# AI Usage Log - Sprint 2

**Project Title:** LaunchPadAI - Job Search and Application Tracking Platform
**Course:** SOEN 341 Software Process (Fall 2026)
**Team Member:** Othmane Balmouddane
**Feature:** Feature 3 - Job Application Submission and Tracking (Sprint 2)
**Repository Directory:** AI_Log/othmane_balmouddane/
**Tool:** Claude  

**How I used AI:** I used Claude Code as a coding assistant for my Feature 3 tasks. I described each task and the decisions it depended on (column names, what the jobs table should hold, which branch to target), and Claude guided me with the SQL and the frontend code in the repository. When something did not work, I reported the error and we fixed it together.

---

## Log Entry 1: Planning and Local Setup

- **What AI did / what I did:** I gave Claude the Feature 3 task split. Claude read the repository and suggested a task order (migration first, since it blocks the rest).
- **Example prompt:** "Here is what we have to do, look at my tasks and tell me where I would start."
- **AI response:** Claude listed my tasks in dependency order and pointed out that no `jobs` table existed yet, which my migration needed.
- **Validation:** I ran the app on localhost. Registering first failed with "Invalid path specified in request URL"; Claude found that my Supabase URL ended in `/rest/v1/`, and after I removed it, registering and logging in worked.
- **Decision:** Accepted.
- **Responsible Person:** Othmane Balmouddane

## Log Entry 2: Applications Migration (TASK-2.12)

- **What AI did / what I did:** Claude thaught me what I needed to know about supabase for the creation of `applications.sql`: the status enum, the `applications` table with `unique (job_id, seeker_id)`, defaults for `status` and `created_at`, an `updated_at` trigger, and a minimal `jobs` table since none existed. It matched the columns to Fatmagul's `submitApplication()`. I asked Claude to explain each part before running it.
- **Example prompt:** "Can you tell me what this SQL program does?"
- **AI response:** Claude explained each section of the file (tables, enum, unique constraint, trigger, policies) in plain language.
- **Validation:** Claude first tested the file on a local throwaway Postgres (PGlite): 20 checks passed, including the duplicate insert failing with error 23505. I then did a dry run in the Supabase SQL editor wrapped in `BEGIN; ... ROLLBACK;`, then ran it for real ("Success. No rows returned").
- **Decision:** Accepted.
- **Responsible Person:** Othmane Balmouddane

## Log Entry 3: Row Level Security (TASK-2.12a)

- **What AI did / what I did:** Claude told me that I needed to add RLS policies on `applications`: seekers can insert only as themselves with status Applied, seekers read only their own rows, recruiters read applications to jobs they posted, and nobody can update or delete (recruiter status updates are noted for Sprint 3). 
- **Example prompt:** "I get that [Supabase 'Potential issues detected' warning], what do I do?"
- **AI response:** Claude told me to choose "Run without RLS" for that run.
- **Validation:** I tested it with a dummy job seeker, which worked.
- **Decision:** Accepted.
- **Responsible Person:** Othmane Balmouddane
