# AI Usage Log — Sprint 1

**Project Title:** LaunchpadAI — Job Search and Application Tracking Platform[cite: 1]  
**Course:** SOEN 341 Software Process (Fall 2026)[cite: 1]  
**Team Member:** Sudhansu Mohanty[cite: 1]  
**Repository Directory:** `AI_Log/sudhansu_mohanty/`[cite: 1]  

---

## Log Entry 1: Elicitation & Definition of US-01 (Account Registration & Roles)

* **Task ID/Title:** Task 1.0 / US-01: User Registration with Role Selection[cite: 1, 6]
* **Purpose of AI Use:** Brainstorming, initial requirements elicitation, and task breakdown for user registration[cite: 1].
* **Chat Link or Prompt/Response:**
  * **Tool:** Gemini / ChatGPT[cite: 1]
  * **Link:** [Insert Chat Link if available, otherwise refer to Appendix][cite: 1]
  * **Prompt:**
    > "Act as an Agile product manager and software requirements analyst. We are building LauchPadAI for SOEN 341, a web-based platform designed to help job seekers manage their search activities and recruiters manage candidate applications.
    > 
    > Primary Users:
    > 1. Job Seekers: Need to create profiles, upload resumes, search jobs, submit applications, and track progress (Applied, Interview, Offered, Rejected).
    > 2. Recruiters: Need to post jobs, manage job listings, and review incoming candidate pipelines.
    > 
    > Generate 10 distinct, structured user stories following the Agile template ('As a [role], I want to [action], so that [outcome]'). For each story, provide 2 to 4 concrete acceptance criteria and 2 to 3 subtasks covering database, backend API, and frontend implementation."[cite: 1]
  * **AI Response (Raw US-01 Output):**
    > **User Story:** As a platform visitor, I want to register for an account using my email and password and select my role (Job Seeker or Recruiter), so that I can access the correct platform features for my needs[cite: 1, 6].
    > 
    > **Acceptance Criteria:**
    > - Users can sign up with an email and password.
    > - Users choose between 'Job Seeker' and 'Recruiter' via a radio button.
    > - Successful signup sends a confirmation email and logs the user in.
    > 
    > **Tasks:**
    > - Create user database table.
    > - Implement signup API endpoint.
    > - Build registration form interface.
* **AI-Suggested Content:** Baseline registration story, fundamental role toggle concept, and standard authentication subtasks[cite: 1, 6].
* **Validation:** 
  * Cross-referenced against the SOEN 341 Sprint 1 recommended demonstration deliverables (Feature 1: User Registration/Login)[cite: 1].
  * Evaluated technical feasibility against Supabase Auth, identifying that custom user data and roles belong in a linked `public.profiles` table rather than the protected `auth.users` schema[cite: 5].
  * Reviewed during team meeting; confirmed that acceptance criteria needed explicit validation rules (e.g., password length, unique email error handling)[cite: 6].
* **Decision:** **Modified before use**[cite: 1].
  * Rewrote acceptance criteria to include PostgreSQL automated trigger execution (`handle_new_user`) in Supabase to sync identity metadata into `public.profiles`[cite: 5, 6].
  * Restructured subtasks into concrete GitHub Issues: **Task 1.1** (SQL migration & role enum trigger), **Task 1.2** (Frontend registration form UI), and **Task 1.3** (Wiring Supabase Auth client with role redirects)[cite: 5, 6].
* **Reflection:** The generated output provided a functional starting point, but it was generic[cite: 1]. Adapting it required specifying our Supabase architecture, Row Level Security (RLS) constraints, and edge-case handling to make the tasks actionable for Sprint 1 development[cite: 1, 5].
* **Responsible Person:** Sudhansu Mohanty[cite: 1]

---

## Log Entry 2: Elicitation & Definition of US-04 (Resume Upload & Storage)

* **Task ID/Title:** Task 1.0 / US-04: Resume Document Upload & Storage[cite: 1, 6]
* **Purpose of AI Use:** Requirements elicitation, storage architecture scoping, and task decomposition for resume handling[cite: 1].
* **Chat Link or Prompt/Response:**
  * **Tool:** Gemini / ChatGPT[cite: 1]
  * **Link:** [Insert Chat Link if available, otherwise refer to Appendix][cite: 1]
  * **Prompt:** *(Elicited as part of the shared 10-story prompt referenced in Log Entry 1)*[cite: 1]
  * **AI Response (Raw US-04 Output):**
    > **User Story:** As a job seeker, I want to upload my resume to my account, so that recruiters can review my qualifications when I apply for jobs[cite: 1, 6].
    > 
    > **Acceptance Criteria:**
    > - Candidate can select and upload a resume document from their device.
    > - The file name is visible on their profile.
    > - The uploaded file can be deleted or replaced.
    > 
    > **Tasks:**
    > - Configure file storage on server.
    > - Build file upload dropzone UI.
    > - Link file URL to candidate profile.
* **AI-Suggested Content:** General user story template for file uploading, visibility on profile, and basic replacement capabilities[cite: 1, 6].
* **Validation:** 
  * Verified against Sprint 1 demo requirements (Feature 2: Resume Upload / Profile Management)[cite: 1].
  * Security check: The raw output lacked access control constraints and format verification, creating vulnerabilities around unrestricted uploads and cross-user data access[cite: 5, 6].
  * Stack alignment: Evaluated Supabase Storage bucket capabilities and determined that an RLS policy scoped to `auth.uid()` was necessary to isolate resumes[cite: 5, 6].
* **Decision:** **Modified before use**[cite: 1].
  * Added explicit acceptance criteria: limit file types to PDF only, enforce a 5 MB file size limit, and require storage inside a private Supabase Storage bucket[cite: 5, 6].
  * Formatted subtasks into repository work items: **Task 4.1** (Provision private bucket with authenticated RLS policy), **Task 4.2** (Client-side drag-and-drop UI with format/size validation), and **Task 4.3** (Upload API integration and metadata persistence to profile)[cite: 5, 6].
* **Reflection:** AI suggested the overall user need, but failed to address security, storage limits, and access controls[cite: 1]. Refining the story ourselves ensured that data isolation and RLS policies were accounted for prior to implementation[cite: 1, 5].
* **Responsible Person:** Sudhansu Mohanty[cite: 1]

---

**Date:** 2026-09-26

**Prompt:**
> can you configure so as the github pages can be used for an early deploymenty