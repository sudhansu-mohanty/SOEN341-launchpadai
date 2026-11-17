# AI Usage Log - Sprint 3

**Project Title:** LaunchPadAI - Job Search and Application Tracking Platform
**Course:** SOEN 341 Software Process (Fall 2026)
**Team Member:** Ahcene Chouyoukh
**Feature:** Feature 1 - Posting Management, Recruiter side, and Continuous Integration (Sprint 3)
**Repository Directory:** AI_Log/ahcene_chouyoukh/
**Tool:** Claude (chat)

**How I used AI:** For each task, Claude gave me step-by-step instructions and code suggestions. I wrote and ran the code myself, then checked the result with Claude. When something was wrong or did not work, I told Claude and it corrected the steps. I did not accept suggestions blindly: several suggestions did not work and I rejected or changed them. I tested every result myself in the app, in Supabase and in the CI log before committing.

---

## Log Entry 1: Archive Migration (Feature 1)

- **What AI did / what I did:** Claude explained how to add an archived_at column to the jobs table and how the visibility and apply rules should work. I noticed that the repository SQL file did not match the live Supabase policies, so Claude asked to see the real policies before writing anything. I ran the migration myself.
- **Example prompt:** "Archived postings must disappear for job seekers but stay visible to the recruiter and to seekers who already applied. Show me how, one step at a time."
- **AI response:** Claude proposed the archived_at column, a read rule for archived postings, and a check that blocks new applications to archived postings. It warned that the rules between jobs and applications can loop, so a small function is needed.
- **Validation:** Checked in the app: an archived posting is hidden from a job seeker, still visible to the recruiter, and keeps its applicants.
- **Decision:** Accepted after fixes. I renamed the migration so it runs after the older ones.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 2: Archive and Restore Buttons and Tabs (Feature 1)

- **What AI did / what I did:** Claude gave the steps for the Archive and Restore buttons and for the Active, Closed and Archived tabs with counts. I edited src/app/recruiter/page.tsx myself and checked each step with Claude.
- **Example prompt:** "Add Archive and Restore buttons and three tabs with counts on the recruiter dashboard."
- **AI response:** Claude showed where to filter the postings by status and archived_at, and how to build the buttons and tabs.
- **Validation:** Archived and restored a test posting and checked that it moved between the tabs and that the counts were correct.
- **Decision:** Accepted after fixes. 
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 3: Form Validation, Confirmations and Unit Tests

- **What AI did / what I did:** Claude helped me write validation for the posting form, confirmations for the close and archive actions, and unit tests for validation and posting visibility. I wrote and ran the tests myself.
- **Example prompt:** "Write unit tests for the posting form validation and for which postings are visible when open, closed or archived."
- **AI response:** Claude explained how to move the rules into small functions that can be tested, and how to write Vitest tests for them.
- **Validation:** Ran npm test locally (4 test files, 29 tests pass) and again in CI on the pull request.
- **Decision:** Accepted after fixes.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 4: Hydration Error on JobCard Dates

- **What AI did / what I did:** The Find Jobs page showed a "Hydration failed" error because the server wrote the date as 10/12/2026 and the browser wrote 2026-10-12. Claude's first suggestions did not work: it first suspected my recruiter page and gave edits that broke that page, and it suggested a fixed time zone, which I rejected because it shows the wrong date for people in other countries. I pushed back each time and Claude corrected its explanation. The cause was the date line in JobCard.tsx, not my recruiter page. My final commit silenced the hydration warnings on the JobCard date and deadline.
- **Example prompt:** "Here is the whole error and my JobCard file. The date must be the real date wherever the user is."
- **AI response:** Claude explained that toLocaleDateString() uses a different locale on the server and in the browser, and gave several possible fixes.
- **Validation:** Reloaded /find-jobs after each change and read the error message each time. The final result is in the commit "Silence hydration warnings on JobCard date and deadline".
- **Decision:** Accepted only after rejecting several of Claude's suggestions. This was the part where AI was least reliable, so I tested each suggestion myself.
- **Responsible Person:** Ahcene Chouyoukh

## Log Entry 5: CI Additions (jsdom, Coverage, Build)

- **What AI did / what I did:** Claude explained how to add jsdom and testing-library, a coverage step and a build step to ci.yml. I installed the packages in the Codespace, edited ci.yml and the Vitest config myself, and pushed.
- **Example prompt:** "Add a coverage step and an npm run build step to ci.yml, using the Supabase secrets."
- **AI response:** Claude explained each step and warned that the build step needs the two NEXT_PUBLIC_SUPABASE secrets, and that it should be removed if it fails.
- **Validation:** Opened the CI log on my pull request: lint, tsc, tests, coverage and build all ran and passed.
- **Decision:** Accepted after fixes.
- **Responsible Person:** Ahcene Chouyoukh
