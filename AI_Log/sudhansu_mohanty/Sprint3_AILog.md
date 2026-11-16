# AI Usage Log — Sprint 3

**Project Title:** LaunchpadAI — Job Search and Application Tracking Platform
**Course:** SOEN 341 Software Process (Fall 2026)
**Team Member:** Sudhansu Mohanty
**Repository Directory:** `AI_Log/sudhansu_mohanty/`

---

## Log Entry 1: Sprint 3 AI Log and Contributions Template Setup

* **Date:** 2026-11-16
* **Task ID/Title:** LOG-AI / LOG-HRS — Prepare Sprint 3 AI Log and Contributions Document
* **Purpose of AI Use:** Setting up the Sprint 3 AI usage log and contributions document in the same format used for Sprint 2, using the existing Sprint 2 files as reference.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "Can we prepare the AI Log for sprint 3 like we did for sprint 2?"

    > "can you also create the contributions section for sprint 3 like in sprint 2?"

    > "can you create the content as well given the features, commits, PRs etc"
  * **AI Response Summary:** Claude read the Sprint 2 AI log and contributions PDF to extract the format, then created a Sprint 3 AI log template with the same 8-field structure. For the contributions document, it queried the git log and GitHub PRs/issues via the CLI to pull actual Sprint 3 data, and authored the full document with real commits, PRs, issues, and time estimates derived from the sprint planning sheet.
* **AI-Suggested Content:** Sprint 3 AI log template (`Sprint3_AILog.md`) and a fully populated contributions document (`Sudhansu_Mohanty_Sprint3_Contributions.md`) covering sprint planning, the resume scoring backend, prompt injection, frontend, and CI/CD fixes.
* **Validation:**
  * Cross-referenced commit hashes against `git log` output to confirm accuracy.
  * Verified PR numbers and URLs against `gh pr list` output.
  * Confirmed issue numbers and titles against `gh issue list` output.
  * Checked time estimates against the sprint planning sheet (TASK-3.6, 3.7, 3.8 effort columns).
* **Decision:** **Accepted with minor edits.**
  * The contributions document was reviewed for section accuracy before converting to PDF.
  * Time estimates were verified against the sprint plan rather than taken at face value from the AI.
* **Reflection:** Querying git and GitHub directly within the same session meant the contributions document was populated with real data rather than placeholders — a significant improvement over manually copying commit hashes and PR links. The iterative prompt pattern (template first, then fill content) worked well and matched the Sprint 2 workflow.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 2: Contributions PDF Generation

* **Date:** 2026-11-16
* **Task ID/Title:** LOG-HRS — Convert Sprint 3 Contributions to PDF
* **Purpose of AI Use:** Converting the Markdown contributions document to a styled PDF matching the Sprint 2 PDF layout (title block, section headers with horizontal rules, bullet lists, tables).
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "can you convert this to a PDF like sprint 2"
  * **AI Response Summary:** Claude attempted WeasyPrint first (unavailable on Windows due to missing GTK libraries), then installed and used ReportLab to build the PDF programmatically — generating a styled layout with matching typography, section rules, bullet lists, and formatted tables for commits, PRs, and issues.
* **AI-Suggested Content:** A Python script using ReportLab's Platypus layout engine to generate `Sudhansu_Mohanty_Sprint3_Contributions.pdf` with the same visual structure as the Sprint 2 PDF.
* **Validation:**
  * Confirmed the PDF was generated without errors and matched the Sprint 2 layout (title, role, summary, key contributions, commits table, PRs table, issues table).
  * Verified that all commit hashes, PR numbers, and issue links were correctly rendered in the output.
* **Decision:** **Accepted as-is.**
  * The generated PDF matched the Sprint 2 format closely enough for submission.
  * The temporary generation script was deleted after the PDF was produced.
* **Reflection:** WeasyPrint failing on Windows was expected in hindsight — GTK dependencies are non-trivial to install. Falling back to ReportLab was the right call; it gives full programmatic control over layout and produces consistent output without system-level dependencies.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 3: pdfplumber Integration and FastAPI Resume Extraction Backend

* **Date:** 2026-11-11
* **Task ID/Title:** TASK-3.7 — Finalizing APIs for PDF Extraction and AI Analysis
* **Purpose of AI Use:** Building the Python backend that accepts a PDF upload, extracts its text using pdfplumber, and feeds the content to the Groq AI API for structured resume scoring. AI was used to help design the prompt injection structure, the FastAPI endpoint, and the pdfplumber extraction logic.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "Help me set up a FastAPI endpoint that accepts a PDF upload and uses pdfplumber to extract the text."

    > "Now take the extracted text and send it to the Groq API with a prompt to score the resume and return JSON."

    > "The API is returning markdown in the JSON response sometimes — how do I strip it reliably?"
  * **AI Response Summary:** Claude provided the full `extract_text()` function using `pdfplumber.open(io.BytesIO(pdf_bytes))`, the FastAPI `/resume/extract` POST endpoint with file validation and error handling for empty/image-only PDFs, and the `analyze_resume()` prompt that instructs the model to return only valid JSON with specific scoring fields (skills, experience, projects, education, impact, formatting). It also suggested the `text.find("{")` / `text.rfind("}")` slice pattern to strip any markdown wrapping from the model response.
* **AI-Suggested Content:** `backend/main.py` — the full FastAPI application including pdfplumber extraction, Groq API integration with retry logic for rate limiting (429 handling with `time.sleep`), email/phone regex extractors, and the structured JSON response schema returned to the frontend.
* **Validation:**
  * Tested the `/resume/extract` endpoint locally with a real PDF and confirmed the response matched the expected JSON schema.
  * Verified the prompt produced consistent section scores (skills 0–25, experience 0–25, projects 0–20, education 0–10, impact 0–10, formatting 0–10) across multiple test resumes.
  * Confirmed the JSON stripping logic handled cases where the model wrapped output in markdown code blocks.
* **Decision:** **Modified before use.**
  * The initial prompt used a larger resume text window (5000 chars); trimmed to 2500 to stay within token limits reliably.
  * Added a total score recalculation on the server side (`total = skills + experience + ...`) as a safety check in case the model's self-reported `total_score` was inconsistent.
  * Rate limit retry logic (3 attempts, 8s sleep) was added after observing 429 errors during testing.
* **Reflection:** AI significantly accelerated the backend setup — the pdfplumber + FastAPI + Groq pipeline would have taken considerably longer to piece together from scratch. The most valuable contribution was the prompt design for structured JSON output; getting a model to return only valid JSON without markdown wrapping required iteration that the AI handled quickly.
* **Responsible Person:** Sudhansu Mohanty

---

## Log Entry 4: Resume Score Frontend Integration

* **Date:** 2026-11-11
* **Task ID/Title:** TASK-3.8 — Make Resume Analysis Frontend
* **Purpose of AI Use:** Integrating the resume scoring backend into the existing Next.js score page, building the tab-based results UI (Overview, Score Breakdown, Resume Details), and implementing the animated score ring component.
* **Prompt/Response:**
  * **Tool:** Claude Code (CLI)
  * **Prompts:**
    > "I have a FastAPI backend returning resume scores. Help me connect it to my Next.js score page and display the results."

    > "Can you make an animated score ring using SVG that fills up based on the score out of 100?"

    > "The ESLint build is failing after adding the score page — fix all the errors."
  * **AI Response Summary:** Claude wired the frontend fetch call to `POST /resume/extract` using `FormData` for the file upload, mapped the JSON response fields to the existing `ScoreContext`, and built the tab UI (`overview`, `breakdown`, `resume`) with a `useAnimatedNumber` hook using `requestAnimationFrame` for smooth counter animation. It also generated the `ScoreRing` SVG component with a gradient stroke and cubic-ease `strokeDashoffset` transition, and resolved ESLint errors (unused imports, missing return types, unescaped entities) across the affected files.
* **AI-Suggested Content:** Updated `frontend/src/app/score/page.tsx` — tab navigation, `ScoreRing` SVG component, `useAnimatedNumber` hook, and the backend fetch integration. Also updated `frontend/src/components/ResumeUploader.tsx` to pass the PDF file through to the score page context.
* **Validation:**
  * Manually tested the full upload-to-results flow with several resume PDFs and confirmed scores displayed correctly across all three tabs.
  * Verified the animated ring filled to the correct percentage on page load.
  * Confirmed ESLint passed cleanly before committing (`0de78768`).
* **Decision:** **Accepted with minor edits.**
  * The initial fetch call used `await res.json()` without checking `res.ok` first; added an error guard to surface backend error messages to the user.
  * Tab labels were renamed from AI-suggested defaults to match the team's naming convention used elsewhere in the app.
* **Reflection:** The animated score ring was the trickiest part to get right — the SVG `strokeDashoffset` math combined with the easing function benefited greatly from AI assistance. Fixing ESLint errors in one pass rather than one-by-one also saved significant time near the submission deadline.
* **Responsible Person:** Sudhansu Mohanty

---
