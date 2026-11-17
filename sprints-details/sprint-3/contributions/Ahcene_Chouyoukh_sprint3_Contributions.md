# Sprint 3 Contributions — Ahcene Chouyoukh

**Role:** Developer (Feature 1 Lead: Recruiter Posting Management with Archive and Restore, Continuous Integration)

## Summary

Worked on Feature 1 (Posting Management) on the recruiter side, adding the archive and restore of job postings with the Active, Closed and Archived tabs. Also maintained the Continuous Integration pipeline and wrote unit tests.

**Total time:** 8 hours

## Key Contributions

### Archive Migration (Feature 1): 2 hours
- Added an archived_at column to the jobs table with a Supabase migration.
- Hid archived postings from the job seeker catalog, while the recruiter and the seekers who already applied can still see them.
- Blocked new applications to archived postings.

### Archive and Restore Buttons, Tabs (Feature 1): 2 hours
- Built the Archive and Restore buttons on the Recruiter Dashboard.
- Added the Active, Closed and Archived tabs with the number of postings in each.
- Hid archived jobs from job seekers and showed Closed postings in the saved jobs drawer.

### Form Validation, Confirmations and Unit Tests: 1 hour
- Added validation to the posting form and confirmations for the close and archive actions.
- Wrote unit tests for form validation and posting visibility (18 tests).

### Hydration Warning on JobCard Dates: 15 minutes
- Silenced the hydration warnings on the JobCard date and deadline.

### Continuous Integration Maintenance (CI-3.01 to CI-3.06): 2 hours 30 minutes
- Added jsdom and testing-library so component unit tests run under npm test.
- Added a coverage step that prints the coverage summary in the CI log.
- Added an npm run build step using the NEXT_PUBLIC_SUPABASE secrets, so build errors are caught before main.

### GitHub Issues: 15 minutes
- Wrote the user story for Feature 1 (archived recruiter job post) and its acceptance tests issue with 8 Given/When/Then tests.
- Wrote the Continuous Integration issue.

## Commits

| Commit | Link |
|--------|------|
| c93ec66 | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/c93ec66 |
| 0f1703e | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/0f1703e |
| 3061914 | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/3061914 |
| d41e972 | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/d41e972 |
| ece5d02 | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/ece5d02 |
| 48df14b | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/48df14b |
| 9d493ad | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/9d493ad |

## Pull Requests Merged

| PR | Link |
|----|------|
| 141 | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/141 |

## Issues

| Issue | Link |
|-------|------|
| 133 (User Story 3.10) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/133 |
| 139 (Acceptance Tests for User Story 3.10) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/139 |
| 140 (CI-3.01 to CI-3.06) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/140 |
