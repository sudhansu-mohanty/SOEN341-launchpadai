# AI Usage Log — Sprint 2

**Project Title:** LaunchpadAI — Job Search and Application Tracking Platform
**Course:** SOEN 341 Software Process (Fall 2026)
**Team Member:** Sudhansu Mohanty
**Repository Directory:** `AI_Log/sudhansu_mohanty/`

---

## Log Entry 1: User Story Template Generation for Sprint 2 Features

* **Date:** 2026-10-26
* **Task ID/Title:** US-2.05 / US-2.06 / US-2.08 — Job Catalog Feed, Multi-Filter Search Toolbar, Job Detail View Modal
* **Purpose of AI Use:** Generating structured Agile user story templates for Sprint 2 features, following the same format used in Sprint 1.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "Can you make me User story templates for this task? Role/Scope: Build the responsive job feed grid/list displaying active postings with metadata badges (title, company, location, salary range, and workplace type)."

    > "Role/Scope: Create the search bar with 300ms debounce optimization and multi-filter controls (keyword, location dropdown, category selector, remote/hybrid pills). For this."

    > "Role/Scope: Build the full-page/modal view displaying complete job requirements, company overview, closing countdown badge, and the primary 'Apply Now' trigger."
  * **AI Response Summary:** Claude generated three complete Agile user stories in the established team format, each including a role-scoped description, acceptance criteria, and a task breakdown covering UI components, state management, and backend integration points.
* **AI-Suggested Content:** Full user story templates for US-2.05 (Job Catalog Feed), US-2.06 (Multi-Filter Search Toolbar), and US-2.08 (Job Detail View Modal), including task decompositions and acceptance criteria.
* **Validation:**
  * Cross-referenced each user story against the Sprint 2 deliverables checklist and the team's GitHub milestone.
  * Verified that task decompositions were aligned with the frontend-first approach established in Sprint 1.
  * Reviewed acceptance criteria in the team meeting to confirm coverage of edge cases (missing salary data, unauthenticated users, etc.).
* **Decision:** **Modified before use.**
  * Acceptance criteria were refined to be more specific — for example, the job feed story was updated to explicitly define what metadata is shown when salary or workplace type is absent.
  * Task breakdown for US-2.06 was extended to include persisting filter state during session navigation, which the AI omitted.
  * US-2.08 tasks were reordered to reflect the correct implementation sequence (Apply Now button → auth guard → duplicate check → application flow).
* **Reflection:** AI provided a strong structural starting point, reducing the time needed to draft user stories from scratch. However, edge cases and session-state handling required manual additions. The prompts were deliberately scoped by role/feature, which produced more targeted output than Sprint 1's broad 10-story prompt.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 2: Acceptance Test Definition for Job Detail View

* **Date:** 2026-10-26
* **Task ID/Title:** US-2.08 — Build Detailed Job Description View Modal (Apply Now Trigger)
* **Purpose of AI Use:** Learning what acceptance tests are and generating a practical test checklist for the Apply Now user story.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "I need to create acceptance tests for this, can you teach me what are acceptance tests."

    > "[User Story 2.08] Build Detailed Job Description View Modal | Sudhansu Mohanty #79 [...] For this what would the tests be?"

    > "Can we make a smaller list."

    > "Can we make it just a checklist for my issue description."
  * **AI Response Summary:** Claude explained acceptance tests (user-facing conditions that confirm a feature works as expected from a black-box perspective), then generated a concise checklist for the Apply Now feature covering: button visibility for authenticated users, redirect-to-login for unauthenticated users, "Already Applied" disabled state for duplicate applications, and the application flow trigger on click.
* **AI-Suggested Content:** Explanation of acceptance testing concepts and a condensed 4-item acceptance test checklist formatted for direct use in the GitHub issue description.
* **Validation:**
  * Checklist items were verified against the task breakdown defined in US-2.08.
  * Confirmed all four test cases map to a corresponding implementation task (auth guard, duplicate check, etc.).
* **Decision:** **Accepted with minor edits.**
  * Reduced the initial longer list to 4 focused checklist items that could be directly embedded in the GitHub issue.
  * Adjusted wording of the "unauthenticated user" test case to match the team's routing convention (redirect vs. inline prompt).
* **Reflection:** Using AI to explain the concept first before generating output was effective — it ensured the checklist items were genuine acceptance tests (user-observable outcomes) rather than unit test assertions. The iterative refinement ("make it smaller" → "make it a checklist") produced a usable artifact in a few turns.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 3: Acceptance Tests for Job Catalog Feed and Filter Toolbar

* **Date:** 2026-10-26
* **Task ID/Title:** US-2.05 — Build Job Catalog Feed Component; US-2.06 — Implement Multi-Filter Search Toolbar
* **Purpose of AI Use:** Generating acceptance test checklists for the remaining two Sprint 2 user stories, following the same format established for US-2.08.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "Can you do the same for the other 2 user stories."
    > *(Followed by pasting the full issue descriptions for US-2.06 and US-2.05)*
  * **AI Response Summary:** Claude produced two additional acceptance test checklists — one for the Job Catalog Feed (badge rendering for all metadata fields, graceful handling of missing data, responsive grid layout) and one for the Multi-Filter Search Toolbar (active filter visual state, 300ms debounce behaviour, result count update, filter persistence across navigation).
* **AI-Suggested Content:** Acceptance test checklists for US-2.05 and US-2.06 formatted for GitHub issue descriptions.
* **Validation:**
  * Cross-checked each checklist item against the corresponding task in the issue.
  * Confirmed the debounce test case referenced the correct 300ms threshold defined in the role/scope.
* **Decision:** **Accepted with minor edits.**
  * Added an explicit test case for the empty-state UI (no results found) in the Job Catalog Feed checklist, which the AI omitted.
  * Reworded the filter persistence test to specify "returning from the job detail view" for clarity.
* **Reflection:** Reusing the same prompt pattern ("do the same for the other 2 user stories") was efficient and produced consistent formatting across all three issue descriptions. The AI correctly inferred the checklist style from the previous turn without needing the format re-explained.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 4: Branch Sync and Merge Conflict Resolution

* **Date:** 2026-10-26
* **Task ID/Title:** Branch Management — Sync Sudhansu branch from main
* **Purpose of AI Use:** Pulling teammate changes from main into the Sudhansu branch and resolving any merge conflicts.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "git pull, so I can see my teammate's changes."

    > "Gimme the command."

    > "Can I just compare and have everything from the current main branch in Sudhansu branch."

    > "Yes go ahead."
  * **AI Response Summary:** Claude provided the `git fetch origin` and `git merge origin/main` commands to sync the branch. When conflicts arose (merge conflict markers visible in `Sprint1_AILog.md`), Claude walked through the resolution strategy and identified that the conflicting sections were divergent log entries from different branches.
* **Validation:** Verified branch was up to date with `git log --oneline` after the merge. Confirmed no unresolved conflict markers remained in tracked files.
* **Decision:** **Accepted.** Merge was completed successfully. Conflict markers in `Sprint1_AILog.md` are noted as a known artifact from the diverged branches and will be cleaned up in a dedicated commit.
* **Reflection:** AI correctly identified that a branch sync was needed before beginning Sprint 2 work. The step-by-step command guidance was useful for avoiding accidental force-resets that could lose local work.
* **Responsible Person:** Sudhansu Mohanty

---
