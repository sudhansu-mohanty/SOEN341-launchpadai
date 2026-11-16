alter table public.jobs
  add column if not exists archived_at timestamptz;

create or replace function public.has_applied_to_job(p_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications
    where job_id = p_job_id
      and seeker_id = auth.uid()
  );
$$;

drop policy if exists "Anyone can read jobs" on public.jobs;
drop policy if exists "Read non-archived or own or applied jobs" on public.jobs;

create policy "Read non-archived or own or applied jobs"
on public.jobs
for select
to public
using (
  archived_at is null
  or auth.uid() = posted_by
  or public.has_applied_to_job(id)
);

drop policy if exists "Seekers can apply as themselves" on public.applications;

create policy "Seekers can apply as themselves"
on public.applications
for insert
to authenticated
with check (
  auth.uid() = seeker_id
  and status = 'Applied'::application_status
  and exists (
    select 1
    from public.jobs j
    where j.id = applications.job_id
      and j.status = 'open'
      and j.archived_at is null
  )
);