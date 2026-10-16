-- Run in the Supabase SQL editor. Safe to run more than once.
-- Columns match submitApplication() in frontend/src/lib/applications.ts.

-- Minimal jobs table, only created if it does not exist yet.
-- Remove this block once the real jobs table is in place.
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    posted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fields used by the Find Jobs page (Job type in types/index.ts)
ALTER TABLE public.jobs
    ADD COLUMN IF NOT EXISTS salary_min INTEGER,
    ADD COLUMN IF NOT EXISTS salary_max INTEGER,
    ADD COLUMN IF NOT EXISTS workplace_type TEXT NOT NULL DEFAULT 'in_person'
        CHECK (workplace_type IN ('remote', 'hybrid', 'in_person'));

-- Jobs are public to read; only the poster can change their own jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read jobs"
ON public.jobs;

DROP POLICY IF EXISTS "Recruiters can manage their own jobs"
ON public.jobs;

CREATE POLICY "Anyone can read jobs"
ON public.jobs
FOR SELECT
USING (true);

CREATE POLICY "Recruiters can manage their own jobs"
ON public.jobs
FOR ALL
TO authenticated
USING (auth.uid() = posted_by)
WITH CHECK (auth.uid() = posted_by);

-- Status values (must match ApplicationStatus in lib/applications.ts)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE public.application_status AS ENUM (
            'Applied',
            'Under Review',
            'Interview',
            'Offered',
            'Rejected'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    seeker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_path TEXT NOT NULL,
    cover_note TEXT CHECK (char_length(cover_note) <= 1000),
    status public.application_status NOT NULL DEFAULT 'Applied',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- One application per seeker per job (duplicate insert -> error 23505)
    CONSTRAINT applications_job_seeker_unique UNIQUE (job_id, seeker_id)
);

-- Keep updated_at current when a row changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applications_set_updated_at ON public.applications;

CREATE TRIGGER applications_set_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- No UPDATE or DELETE policies, so nobody can change or delete rows through the API.
-- Sprint 3 (Feature 4): add an UPDATE policy so recruiters can change status
-- on applications to jobs they posted.
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seekers can apply as themselves"
ON public.applications;

DROP POLICY IF EXISTS "Seekers can read their own applications"
ON public.applications;

DROP POLICY IF EXISTS "Recruiters can read applications to their jobs"
ON public.applications;

-- New applications always start as Applied
CREATE POLICY "Seekers can apply as themselves"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seeker_id AND status = 'Applied');

CREATE POLICY "Seekers can read their own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = seeker_id);

-- Note: the recruiter must be able to read the jobs row for this check to pass
CREATE POLICY "Recruiters can read applications to their jobs"
ON public.applications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.jobs
        WHERE jobs.id = applications.job_id
          AND jobs.posted_by = auth.uid()
    )
);

