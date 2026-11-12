-- In-app notifications and reminders.
-- Run in the Supabase SQL editor. Safe to run more than once.
-- Depends on: jobs, applications and saved_jobs. Run applications.sql first.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'application_update',
        'interview_invitation',
        'deadline_reminder',
        'new_application'
    )),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Stops a reminder from being created twice (NULL for one-off events)
    dedupe_key TEXT,
    CONSTRAINT notifications_user_dedupe_unique UNIQUE (user_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only mark notifications as read, not rewrite them
REVOKE ALL ON public.notifications FROM anon, authenticated;
GRANT SELECT, INSERT ON public.notifications TO authenticated;
GRANT UPDATE (read_at) ON public.notifications TO authenticated;

DROP POLICY IF EXISTS "Users can read their own notifications"
ON public.notifications;

DROP POLICY IF EXISTS "Users can mark their own notifications as read"
ON public.notifications;

DROP POLICY IF EXISTS "Users can create their own deadline reminders"
ON public.notifications;

CREATE POLICY "Users can read their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications as read"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Needed by sync_deadline_reminders(), which runs as the signed-in user.
-- Every other type is only created by the triggers below.
CREATE POLICY "Users can create their own deadline reminders"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND type = 'deadline_reminder');

-- Recruiter action: tell the recruiter about a new application
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    job public.jobs%ROWTYPE;
    applicant TEXT;
BEGIN
    SELECT * INTO job FROM public.jobs WHERE id = NEW.job_id;
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    -- to_jsonb because first_name and last_name are optional applicant fields
    applicant := COALESCE(
        NULLIF(TRIM(CONCAT(to_jsonb(NEW)->>'first_name', ' ', to_jsonb(NEW)->>'last_name')), ''),
        'A candidate'
    );

    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
        job.posted_by,
        'new_application',
        'New application',
        format('%s applied to %s.', applicant, job.title),
        '/recruiter'
    );

    RETURN NEW;
END;
$$;

-- Application updates: tell the seeker when their status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    job public.jobs%ROWTYPE;
BEGIN
    SELECT * INTO job FROM public.jobs WHERE id = NEW.job_id;
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    IF NEW.status::TEXT = 'Interview' THEN
        INSERT INTO public.notifications (user_id, type, title, body, link)
        VALUES (
            NEW.seeker_id,
            'interview_invitation',
            'Interview invitation',
            format('%s invited you to interview for %s.', job.company, job.title),
            '/dashboard/applications'
        );
    ELSE
        INSERT INTO public.notifications (user_id, type, title, body, link)
        VALUES (
            NEW.seeker_id,
            'application_update',
            'Application update',
            format('Your application for %s at %s is now %s.', job.title, job.company, NEW.status::TEXT),
            '/dashboard/applications'
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS applications_notify_new ON public.applications;

CREATE TRIGGER applications_notify_new
AFTER INSERT ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.notify_new_application();

DROP TRIGGER IF EXISTS applications_notify_status ON public.applications;

CREATE TRIGGER applications_notify_status
AFTER UPDATE OF status ON public.applications
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.notify_application_status_change();

-- Upcoming deadlines: the app calls this when a signed-in user loads a page.
-- Seekers are reminded about saved jobs they have not applied to, recruiters
-- about their own open postings. Runs as the user, so RLS limits saved_jobs.
CREATE OR REPLACE FUNCTION public.sync_deadline_reminders()
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    uid UUID := auth.uid();
    reminder_window INTERVAL := INTERVAL '3 days';
BEGIN
    IF uid IS NULL THEN
        RETURN;
    END IF;

    INSERT INTO public.notifications (user_id, type, title, body, link, dedupe_key)
    SELECT
        uid,
        'deadline_reminder',
        'Deadline coming up',
        format('Applications for %s at %s close on %s.', j.title, j.company, to_char(j.deadline, 'Mon FMDD')),
        '/find-jobs',
        format('deadline:%s:%s', j.id, j.deadline::DATE)
    FROM public.saved_jobs s
    JOIN public.jobs j ON j.id::TEXT = s.job_id::TEXT
    WHERE j.status::TEXT = 'open'
      AND j.deadline > NOW()
      AND j.deadline <= NOW() + reminder_window
      AND NOT EXISTS (
          SELECT 1 FROM public.applications a
          WHERE a.job_id = j.id AND a.seeker_id = uid
      )
    ON CONFLICT (user_id, dedupe_key) DO NOTHING;

    INSERT INTO public.notifications (user_id, type, title, body, link, dedupe_key)
    SELECT
        uid,
        'deadline_reminder',
        'Your posting closes soon',
        format('Applications for %s close on %s.', j.title, to_char(j.deadline, 'Mon FMDD')),
        '/recruiter',
        format('deadline:%s:%s', j.id, j.deadline::DATE)
    FROM public.jobs j
    WHERE j.posted_by = uid
      AND j.status::TEXT = 'open'
      AND j.deadline > NOW()
      AND j.deadline <= NOW() + reminder_window
    ON CONFLICT (user_id, dedupe_key) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_deadline_reminders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_deadline_reminders() TO authenticated;

-- Lets the bell update live without a page reload
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
       AND NOT EXISTS (
           SELECT 1 FROM pg_publication_tables
           WHERE pubname = 'supabase_realtime'
             AND schemaname = 'public'
             AND tablename = 'notifications'
       ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
END
$$;
