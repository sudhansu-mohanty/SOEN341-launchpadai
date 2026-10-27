# Sprint 2 Contributions — Othmane Balmouddane

**Role:** Full stack (database, application tracking, pull request reviews and merges)
**Feature:** Feature 3 — Job Application Submission and Tracking (with Fatmagul Dedek)
**Period:** 2026-10-05 to 2026-10-26

## Summary

Built the data layer and the tracking side of Feature 3: the `jobs` and `applications` tables with their security policies in Supabase, and the My Applications tracker page with status tabs. Kept the database in line with Fatmagul's apply flow and Sudhansu's Find Jobs page, and reviewed and merged teammates' pull requests.

## Key Contributions

### Database (TASK-2.12)
- Wrote the SQL migration (`database/application.sql`) for the `applications` table: status enum (Applied, Under Review, Interview, Offered, Rejected; default Applied), `unique (job_id, seeker_id)` to prevent duplicate applications, and an `updated_at` trigger
- Created the `jobs` table used by applications, with the salary, workplace type and deadline fields; external jobs stay out of the database since they come from an external API
- Added Row Level Security: seekers can only apply as themselves and only see their own applications, recruiters only see applications to their own jobs, anyone can read jobs, and only the poster can edit a job
- Ran and checked the migration on the shared Supabase project

### Application Tracker (TASK-2.13, TASK-2.14)
- Built the My Applications page (`/dashboard/applications`) showing the job title, company, date applied and a colored status pill for each application
- Added status tabs (All, Applied, Under Review, Interview, Offered, Rejected) with a count on each tab and an empty state per tab
- Added loading, error and empty states, a redirect to login for signed-out users, and a My Applications link in the navbar

### Code Reviews and Team Work
- Coordinated column names with Fatmagul so the apply modal and the table match
- Aligned the `jobs` table with Sudhansu's Find Jobs page
- Reviewed and merged teammates' pull requests (#47, #59)

## Issues Closed

| Issue | Description |
|-------|-------------|
| #56 | TASK-2.12: applications migration |
| #57 | TASK-2.13: Tracker dashboard |
| #58 | TASK-2.14: Status tabs |

## Pull Requests Merged

| PR | Description |
|----|-------------|
| #48 | Applications table, RLS and application tracker page |
| #49 | Supabase tables update |
| #67 | My branch into the Feature 3 branch |
| #73 | Merge main into my branch |
| #47 | Reviewed and merged Sudhansu's Find Jobs page |
| #59 | Reviewed and merged Cheyma's pull request |

## Tech Stack Touched

Supabase (PostgreSQL, Row Level Security, SQL Editor), Next.js, React, TypeScript, Tailwind CSS, GitHub (pull requests, Actions CI)
