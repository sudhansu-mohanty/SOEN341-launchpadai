# AI Usage Log - Sprint 2

**Project Title:** LaunchPadAI - Job Search and Application Tracking Platform
**Course:** SOEN 341 Software Process (Fall 2026)
**Team Member:** Ahcene Chouyoukh
**Feature:** Feature 4 - Recruiter (Sprint 2)
**Repository Directory:** AI_Log/Ahcene_Chouyoukh/
**Tool:** Claude (chat)

**How I used AI:** For each task, Claude gave me step-by-step instructions and code suggestions. I wrote and ran the code myself, then checked the result with Claude. When something was wrong or did not work, Claude corrected the steps and I fixed it. I tested every result myself in the app and in Supabase before committing.

---

## Log Entry 1: Recruiter Dashboard (TASK-2.15)

- **What AI did / what I did:** Claude explained what to build and where. I wrote the dashboard that lists the recruiter's postings and applications, and checked it with Claude.
- **Example prompt:** "I need the recruiter dashboard to show my postings. Go one small step at a time, exact things to click or type."
- **AI response:** Claude gave the first action only (which file to open and what to add) and asked me to report what I saw before the next step.
- **Validation:** Logged in as recruiter1 and saw the test posting and test application.
- **Decision:** Accepted after fixes. Applicant names first showed as "Applicant xxxx" because there was no profiles read policy; I added the policy afterwards.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 2: Applicant Modal (TASK-2.16)

- **What AI did / what I did:** Claude guided me to build the applicant modal with a View resume button. View resume first did not open the file; Claude explained it was a Supabase storage permission issue and I added the policy "Recruiters can read applicant resumes" myself.
- **Example prompt:** "View resume does not open the file, what is wrong?"
- **AI response:** Claude explained it was a storage permission problem and gave the steps to add a read policy for recruiters in Supabase.
- **Validation:** After adding the policy, View resume opened the file as recruiter1.
- **Decision:** Accepted after the correction.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 3: Recruiter Navbar and Create Posting Form

- **What AI did / what I did:** Claude gave instructions to hide My Resumes and Find Jobs for recruiters and to build the create posting form. I coded both and used workplace_type as the job type.
- **Example prompt:** "Hide My Resumes and Find Jobs in the navbar when the user is a recruiter."
- **AI response:** Claude showed how to read the user's role and only show the links for job seekers.
- **Validation:** Checked the navbar with a recruiter and a job seeker account, and created a posting and saw it in Supabase.
- **Decision:** Accepted.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 4: Job Status Open/Closed (US-06)

- **What AI did / what I did:** Claude gave steps for the status column, the Open/Closed toggle and the edit modal. I ran the SQL and wrote the code, then checked with Claude.
- **Example prompt:** "Add a status column to jobs with a toggle to open or close a posting."
- **AI response:** Claude gave the SQL for the column and the update call for the toggle, one step at a time.
- **Validation:** Toggled a posting and edited it in the modal, then confirmed the change in the database.
- **Decision:** Accepted after fixes.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 5: CI and Pull Request (Issue #60)

- **What AI did / what I did:** Claude explained how to write ci.yml (lint, tsc, Vitest) and how to open a pull request into main. I wrote the workflow and opened the PR.
- **Example prompt:** "Help me create ci.yml that runs lint, tsc and Vitest for the frontend."
- **AI response:** Claude explained the workflow structure and gave the steps to run in the frontend folder.
- **Validation:** Pushed and checked the GitHub Actions run until the checks passed on the PR.
- **Decision:** Accepted after fixes.
- **Responsible Person:** Ahcene Chouyoukh
