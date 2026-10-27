# Sprint 2 Contributions — Sudhansu Mohanty

**Role:** Developer (Find Jobs Feature, Job Detail View, SerpAPI Integration, Sprint Planning & Task Breakdown)

## Summary

Contributed to Sprint 2 by taking responsibility for the job discovery experience — building the job catalog feed, search and filter toolbar, and the job detail panel with the Apply Now trigger. Also integrated SerpAPI to surface external job postings alongside recruiter-created listings, and co-led sprint planning and task breakdown with Cheyma.

## Key Contributions

### Sprint Planning & Task Breakdown (with Cheyma): 1 hr 45
- Participated in planning Sprint 2 deliverables and identifying the work required to implement features.
- Broke down larger requirements into smaller development tasks.
- Helped clarify feature scope, implementation steps and task dependencies.

### Job Catalog Feed (US-2.05): 3 hr 30
- Built the responsive job feed page displaying active postings with metadata badges (title, company, location, salary range, and workplace type).
- Implemented conditional badge rendering to handle missing salary or workplace data gracefully.
- Added sorting functions to distinguish between recruiter-posted jobs and external API listings.

### Multi-Filter Search Toolbar (US-2.06): 2 hr 30
- Implemented the search bar with keyword filtering and multi-filter controls (location, category, remote/hybrid pills).
- Added debounce optimization to reduce unnecessary re-renders on input.
- Displayed active filter state visually and updated result count as filters change.

### Job Detail View & Apply Now (US-2.08): 3 hr 00
- Built a slide-in panel displaying full job details when a posting is selected from the feed.
- Added the primary Apply Now button with a placeholder application flow for Sprint 2.
- Fixed a database issue that prevented new profiles from being created correctly.

### SerpAPI Integration: 2 hr 00
- Integrated SerpAPI to pull in external job postings and surface them alongside recruiter-created listings.
- Added filtering logic to cleanly separate internal vs. external postings within the feed.

## Commits

| Commit | Description |
|--------|-------------|
| 7a7d167b | [Add Find Jobs page with search and filters](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/7a7d167b) |
| 6e0ee41e | [Added slide-in job detail panel and Apply Now button](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/6e0ee41e) |
| 781a8c7f | [Added sorting to distinguish recruiter vs. API jobs](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/781a8c7f) |
| 59f2d0fc | [Fixed the database issue, we can create a new profile now](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/59f2d0fc) |
| 14a28daf | [Integrated SerpAPI to show external job postings](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/14a28daf) |
| dcebe951 | [Added Sprint 2 details and moved docs to sprint-details](https://github.com/sudhansu-mohanty/SOEN341-launchpadai/commit/dcebe951) |

## Pull Requests Merged

| PR | Title | Link |
|----|-------|-------|
| 47 | Add Find Jobs page with search and filters | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/47 |
| 51 | Add Find Jobs page with filters, sorting, and job detail panel | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/51 |
| 62 | Sudhansu additions | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/pull/62 |

## Issues

| Issue | Link |
|-------|-------|
| 2.05 / 74 (User Story) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/74 |
| 2.06 / 77 (User Story) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/77 |
| 2.08 / 79 (User Story) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/79 |
| 82 (Acceptance Tests for 2.05 / 74) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/82 |
| 81 (Acceptance Tests for 2.06 / 77) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/81 |
| 80 (Acceptance Tests for 2.08 / 79) | https://github.com/sudhansu-mohanty/SOEN341-launchpadai/issues/80 |
