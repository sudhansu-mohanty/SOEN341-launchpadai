# Sprint 3 Contributions — Sudhansu Mohanty

**Role:** Developer (Resume Scoring Feature, PDF Extraction & AI Analysis, CI/CD Fixes, Sprint Planning & Task Breakdown)

---

## Summary

Contributed to Sprint 3 by owning the resume analysis experience end-to-end — building the AI-powered resume scoring backend with PDF extraction via pdfplumber, integrating a prompt injection pipeline for structured AI feedback, and surfacing the results on the frontend. Also co-led sprint planning and task decomposition with Cheyma, and resolved CI/CD pipeline failures blocking the team's deployment.

---

## Key Contributions

### Sprint Planning & Task Breakdown (with Cheyma): 2 hr 30

- Co-created the Sprint 3 milestone on GitHub with deadline and linked user stories.
- Decomposed every Sprint 3 story into child task issues and assigned them to team members.
- Ensured each story had at least 2 acceptance-test issues linked before sprint kickoff.
- Updated capacity, story points, and the Definition of Done in the sprint planning document.

---

### Resume PDF Extraction & AI Scoring Backend (TASK-3.7 / US-3.7): 3 hr 00

- Finalized the Python API using pdfplumber to extract raw text from uploaded resume PDFs.
- Integrated the extracted text into an AI analysis pipeline that returns structured scoring feedback.
- Handled edge cases for malformed or image-only PDFs to prevent silent failures.

---

### AI Prompt Injection for Resume Feedback (TASK-3.6): 3 hr 00

- Designed and implemented the prompt injection layer that formats extracted resume content for AI analysis.
- Structured the prompt to produce consistent, section-aware feedback (skills, experience, education, formatting).
- Tested and refined prompt outputs to ensure scoring results were actionable and readable on the frontend.

---

### Resume Analysis Frontend (TASK-3.8 / US-3.8): 1 hr 00

- Built the frontend view for displaying AI-generated resume analysis results to the user.
- Connected the frontend to the Python scoring API and rendered structured feedback per resume section.

---

### CI/CD & Deployment Fixes: 1 hr 00

- Diagnosed and fixed a cross-platform lockfile mismatch that was breaking the CI pipeline (`npm ci` failing due to package-lock.json divergence between Windows and the CI runner).
- Switched CI to `npm install` and bumped the Node version to 22 to match the project's runtime requirements.
- Resolved all ESLint errors and warnings that were failing the build step.

---

## Commits

| Commit     | Description |
|------------|-------------|
| `e430fc46` | Added the resume score feature |
| `4f26d455` | Added the Resume scoring feature, added the python file to parse PDF to analyse the CV section |
| `0de78768` | Fix all ESLint errors and warnings |
| `3ec71c52` | Fix CI: sync package-lock.json with package.json |
| `eb3c2771` | Fix CI: use npm install instead of npm ci to avoid cross-platform lockfile mismatch |
| `364941a0` | Fix deploy: bump Node to 22 and use npm install to fix lockfile mismatch |

---

## Pull Requests Merged

| PR  | Title | Link |
|-----|-------|------|
| 108 | Resume Scoring feature added | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/108 |
| 116 | Fix CI/CD: sync lockfile, bump Node to 22, use npm install | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/116 |

---

## Issues

| Issue | Link |
|-------|------|
| 3.7 / 125 (User Story) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/125 |
| 3.8 / 126 (User Story) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/126 |
| 127 (Acceptance Tests for US-3.8) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/127 |
| 128 (Acceptance Tests for US-3.7) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/128 |
