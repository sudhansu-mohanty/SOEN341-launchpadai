# Sprint 1 Contributions — Sudhansu Mohanty

**Role:** Developer (Frontend, CI/CD, Backend integration)
**Period:** 2026-09-19 to 2026-09-27

## Summary

Set up the project's frontend from scratch, wired up GitHub Pages CI/CD, built the
authentication and resume-upload flows, and integrated Supabase for auth and file storage.

## Key Contributions

### GitHub Repository Setup
- Created the GitHub repository for the project and performed initial setup
- Added team members to the repository and configured their permissions
- Organized the repository's base folder structure (documentation, meeting minutes, AI logs, sprint deliverables)
- Set up the GitHub project board for sprint/task tracking
- Configured branch protection rules
- Set up a Discord bot/webhook to post GitHub commit and pull request updates into the team's Discord server, so teammates could keep track of each other's activity — `1ad042b`

### Project & CI/CD Setup
- Initialized the frontend app (reused and adapted structure from a prior project) — `baebfeb`
- Initialized and configured GitHub Pages for the project — `8a45a59`, `0a90dc3`
- Added a GitHub Actions workflow to build and deploy the Next.js site to GitHub Pages — `2508421`
- Fixed a CI build failure caused by `next/font/google` not being able to fetch fonts in GitHub Actions; switched to a Google Fonts CDN link instead — `d7abde2`
- Fixed internal navigation using raw `<a>` tags that broke on GitHub Pages' basePath; replaced them with `next/link` — `ba8fb85`
- Wired Supabase environment variables (URL + anon key) into the GitHub Pages build pipeline — `bf6ced8`

### Authentication & Onboarding
- Built the initial Login and Register pages (frontend only) — `a9f9e8c`
- Integrated Supabase Auth into the login/register flow and added a Dashboard page; simplified the homepage — `1ca35e2`
- Added a Job-Seeker vs. Recruiter role selection option during registration — `48b50fb`

### Resume Upload Feature
- Built the initial resume upload page and `ResumeUploader` component — `a9f9e8c`
- Implemented resume storage/retrieval logic in `frontend/src/lib/storage.ts` and refined the resume dashboard page — `aea1cd4`
- Switched resume downloads from `getPublicUrl` to `createSignedUrl` so files work correctly with private Supabase storage buckets; upgraded Next.js and dependencies to v16 — `b917126`

### Code Quality / Project Structure
- Added global TypeScript type definitions (`frontend/src/types/index.ts`) for shared types used across Sprint 1 — `fbdc9b1`

### Documentation
- Created and maintained the personal AI usage log (`AI_Log/sudhansu_mohanty/Sprint1_AILog.md`) across the sprint
- Added the meeting minutes link to the repository (merged via PR #16) — `0d6eae6`
- Revised the root `README.md` with project name, team details, technologies, and hosting info (merged via PRs #16/#17) — `2dea567`, `29d8332`

## Files Primarily Owned / Authored

- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`
- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/dashboard/resume/page.tsx`
- `frontend/src/components/ResumeUploader.tsx`
- `frontend/src/lib/storage.ts`
- `frontend/src/lib/supabase.ts`
- `frontend/src/types/index.ts`
- `.github/workflows/nextjs.yml`, `.github/workflows/deploy.yml`

## Pull Requests Merged

| PR | Description |
|----|-------------|
| #16 | Add meeting minutes link to the repository |
| #17 | Revise README with new project information |
| #28 | Use signed URLs for Supabase storage and upgrade Next.js to v16 |

## Tech Stack Touched

Next.js 16 (React), TypeScript, Supabase (Auth + Storage), GitHub Actions, GitHub Pages.
