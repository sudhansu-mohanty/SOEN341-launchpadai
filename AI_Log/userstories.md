# LaunchPadAI — Product Backlog & User Stories (Sprint 1 to Sprint 4)

**Project Title:** LaunchPadAI — Intelligent Job Search and Application Tracking Platform[cite: 1]  
**Course:** SOEN 341 Software Process (Fall 2026)[cite: 1]  
**Deliverable:** Sprint 1 Requirements & Backlog Specification[cite: 1]  

---

## 📌 Sprint 1 Live Code Demonstration Alignment
The SOEN 341 Sprint 1 evaluation requires implementing and demonstrating **at least two running features** live during the lab check-in[cite: 1]:
1. **Feature 1:** User Registration & Authentication (Sign-up, Login, Role Routing)[cite: 1, 4].
2. **Feature 2:** Resume Upload & User Profile Storage (Drag-and-Drop Resume Dropzone with Supabase Storage)[cite: 1, 4].

The first three user stories (**US-01**, **US-02**, and **US-03**) are structured so that these implementation tasks form the active work for Sprint 1[cite: 1, 4].

---

## Part 1: AI-Generated User Stories (US-01 to US-10)
*Origin: Elicited via generative AI prompt session and refined to match Supabase and Next.js technical constraints (logged in `AI_Log/`)[cite: 1, 4].*

### US-01 [User Story #1] | Sudhansu Mohanty
* **User Story:** As a platform visitor, I want to register for an account using my email and password and select my role (`job_seeker` or `recruiter`), so that I gain access to role-tailored platform workspaces[cite: 1, 4].
* **Assignee:** `@SudhansuMohanty`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 1` | **Status:** In Progress[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `auth`, `sprint-1-demo`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Signup form accepts `email`, `password`, `full_name`, and a role selector toggle (`job_seeker` vs. `recruiter`)[cite: 4].
  - [ ] Enforces input validation (valid email format and minimum 8-character passwords).
  - [ ] Duplicate email registrations render an inline warning banner without crashing the application[cite: 4].
  - [ ] Supabase database trigger automatically executes upon signup to populate `public.profiles` with the designated role[cite: 4].
* **Tasks (Sprint 1 Implementation Scope):**
  - [ ] **Task 1.1:** Write and run Supabase SQL migration for `public.profiles` schema, `user_role` enum, and the `handle_new_user` automated trigger[cite: 4].
  - [ ] **Task 1.2:** Build responsive frontend registration form UI with role toggle and error state banners[cite: 4].
  - [ ] **Task 1.3:** Wire registration component to `supabase.auth.signUp()` with metadata payload and configure post-signup routing[cite: 4].

---

### US-02 [User Story #2] | Sudhansu Mohanty
* **User Story:** As a registered user, I want to log in securely with my credentials and maintain my active session, so that I can access protected dashboards without repeatedly re-authenticating[cite: 1, 4].
* **Assignee:** `@SudhansuMohanty`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 1` | **Status:** In Progress[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `auth`, `sprint-1-demo`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] User can authenticate via Supabase Auth using email and password[cite: 4].
  - [ ] Auth state persists across page navigation and browser refreshes using secure JWT session cookies[cite: 4].
  - [ ] System handles authentication errors gracefully (e.g., wrong password, unregistered user)[cite: 4].
  - [ ] Redirects candidates to `/seeker/dashboard` and recruiters to `/recruiter/dashboard` based on profile role[cite: 4].
  - [ ] Logout action purges session tokens and resets client application state[cite: 4].
* **Tasks (Sprint 1 Implementation Scope):**
  - [ ] **Task 2.1:** Implement Supabase session provider and Next.js route-guard middleware for protected endpoints[cite: 4].
  - [ ] **Task 2.2:** Build login UI component with credential inputs, inline error validation, and loading indicators[cite: 4].
  - [ ] **Task 2.3:** Wire login form to `supabase.auth.signInWithPassword()` and implement client logout handler[cite: 4].

---

### US-03 [User Story #3] | Sudhansu Mohanty
* **User Story:** As a job seeker, I want to drop and upload my PDF resume directly to my profile, so that it is securely stored in the cloud and ready to attach to job applications[cite: 1, 4].
* **Assignee:** `@SudhansuMohanty`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 1` | **Status:** In Progress[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `job-seeker`, `sprint-1-demo`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Interactive dropzone allows drag-and-drop or browsing for PDF resumes.
  - [ ] Rejects unsupported MIME types (non-PDF) and files exceeding 5 MB with inline feedback.
  - [ ] Uploaded file stores in a private Supabase Storage bucket under an isolated user path (`resumes/{user_id}/`)[cite: 4].
  - [ ] Upload successfully updates the `resume_url` and file metadata on the seeker's `profiles` record[cite: 4].
* **Tasks (Sprint 1 Implementation Scope):**
  - [ ] **Task 3.1:** Provision private `resumes` Supabase Storage bucket with authenticated Row Level Security (RLS) policies[cite: 4].
  - [ ] **Task 3.2:** Build interactive drag-and-drop resume upload UI component with file size/type validation[cite: 4].
  - [ ] **Task 3.3:** Connect file dropzone to `supabase.storage.upload()` and persist file URL to `public.profiles`[cite: 4].

---

### US-04 [User Story #4] | Cheyma Abidi
* **User Story:** As a job seeker, I want to manage my personal profile details, technical skills, and portfolio links, so that recruiters can review my qualifications[cite: 1, 4].
* **Assignee:** `@CheymaAbidi`[cite: 1, 4] | **Priority:** Medium | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Profile page displays seeker's full name, professional headline, bio, and portfolio links[cite: 4].
  - [ ] Seeker can append and remove individual technical skill badges[cite: 4].
  - [ ] Supabase Row Level Security restricts profile edits strictly to the profile owner (`auth.uid() = id`)[cite: 4].
* **Tasks:**
  - [ ] **Task 4.1:** Configure Supabase RLS update policies on `public.profiles` for authenticated users[cite: 4].
  - [ ] **Task 4.2:** Build profile management UI view with editable text fields and interactive skill tag chips[cite: 4].
  - [ ] **Task 4.3:** Implement profile update mutation to save profile changes to Supabase database.

---

### US-05 [User Story #5] | Cheyma Abidi
* **User Story:** As a recruiter, I want to create and publish a new job opening with detailed specifications, so that qualified candidates can discover and apply for the role[cite: 1, 4].
* **Assignee:** `@CheymaAbidi`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `recruiter`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Form contains title, company name, location, job type, description, and application deadline[cite: 1, 4].
  - [ ] Database RLS prevents users with `job_seeker` role from creating records in `jobs` table[cite: 4].
  - [ ] Successfully published postings immediately show in the catalog with status `Open`[cite: 4].
* **Tasks:**
  - [ ] **Task 5.1:** Design `jobs` table schema in Supabase with recruiter foreign key and RLS constraints[cite: 4].
  - [ ] **Task 5.2:** Build recruiter job posting creation form UI with validation on required fields[cite: 4].
  - [ ] **Task 5.3:** Connect job creation form to Supabase insert API endpoint.

---

### US-06 [User Story #6] | Cheyma Abidi
* **User Story:** As a recruiter, I want to manage my published job listings, so that I can edit posting specifications or close filled roles[cite: 1, 4].
* **Assignee:** `@CheymaAbidi`[cite: 1, 4] | **Priority:** Medium | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `recruiter`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Recruiter dashboard lists all postings authored by the logged-in recruiter[cite: 4].
  - [ ] Recruiter can toggle job status between `Open` and `Closed`[cite: 4].
  - [ ] Closed jobs remain viewable in recruiter history but disable new candidate submissions[cite: 4].
* **Tasks:**
  - [ ] **Task 6.1:** Build Recruiter Dashboard view displaying active and archived job postings[cite: 4].
  - [ ] **Task 6.2:** Implement job status toggle mutation in Supabase to toggle `Open` and `Closed` states[cite: 4].
  - [ ] **Task 6.3:** Build edit modal allowing recruiters to update descriptions, requirements, and deadlines[cite: 1, 4].

---

### US-07 [User Story #7] | Othmane Balmouddane
* **User Story:** As a job seeker, I want to search open positions by keywords and filter by location or job type, so that I can discover relevant openings[cite: 1, 4].
* **Assignee:** `@OthmaneBalmouddane`[cite: 1, 4] | **Priority:** Medium | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Search input matches keywords against job titles and descriptions in real time[cite: 1, 4].
  - [ ] Users can filter by location (Remote, Hybrid, On-site) and employment type (Full-time, Internship)[cite: 1, 4].
  - [ ] Empty state graphic or notification renders cleanly when no listings match query filters.
* **Tasks:**
  - [ ] **Task 7.1:** Implement backend PostgreSQL text search index and multi-filter query on `jobs` table[cite: 4].
  - [ ] **Task 7.2:** Build debounced search input component on the main job board[cite: 4].
  - [ ] **Task 7.3:** Create sidebar filter controls for location, job type, and salary range[cite: 1, 4].

---

### US-08 [User Story #8] | Othmane Balmouddane
* **User Story:** As a job seeker, I want to apply directly to a job opening with my stored resume attached, so that the hiring team can review my candidacy[cite: 1, 4].
* **Assignee:** `@OthmaneBalmouddane`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] "Apply Now" button prompts a confirmation modal attaching the candidate's default resume[cite: 1, 4].
  - [ ] Submitting creates a record in `applications` initialized to status `Applied`[cite: 1, 4].
  - [ ] Database enforces a unique composite constraint preventing duplicate applications for the same job[cite: 4].
* **Tasks:**
  - [ ] **Task 8.1:** Create `applications` table schema in Supabase with unique composite key on `(job_id, seeker_id)`[cite: 4].
  - [ ] **Task 8.2:** Build application submission modal attaching candidate profile and resume snapshot[cite: 1, 4].
  - [ ] **Task 8.3:** Connect submission action to database insert endpoint with success confirmation[cite: 4].

---

### US-09 [User Story #9] | Othmane Balmouddane
* **User Story:** As a job seeker, I want to view a tracking dashboard of all my submitted applications, so that I can monitor my hiring progress across stages[cite: 1, 4].
* **Assignee:** `@OthmaneBalmouddane`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Dashboard displays all applications submitted by the logged-in candidate[cite: 1, 4].
  - [ ] Each application displays company name, role title, submission date, and stage badge (`Applied`, `Interview`, `Offered`, `Rejected`)[cite: 1, 4].
  - [ ] Applications can be filtered by status tab (`All`, `Applied`, `Interview`, `Offered`, `Rejected`)[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 9.1:** Write query joining `applications` and `jobs` filtered by the authenticated seeker's ID[cite: 4].
  - [ ] **Task 9.2:** Build job seeker application tracking dashboard UI with stage indicators[cite: 1, 4].
  - [ ] **Task 9.3:** Build detailed application view showing submission timestamps and role details[cite: 1, 4].

---

### US-10 [User Story #10] | Fatmagul Dedek
* **User Story:** As a recruiter, I want to review incoming candidate applications and transition their progress stages, so that our hiring pipeline reflects current evaluations[cite: 1, 4].
* **Assignee:** `@FatmagulDedek`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 3` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `ai-generated`, `recruiter`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Recruiter can view candidate list per job posting with applicant profiles and resumes[cite: 1, 4].
  - [ ] Allows recruiter to view candidate profile summaries and download uploaded resume files[cite: 1, 4].
  - [ ] Status dropdown updates applicant status (`Applied` -> `Interview` -> `Offered` -> `Rejected`)[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 10.1:** Build recruiter pipeline dashboard grouped by job posting[cite: 1, 4].
  - [ ] **Task 10.2:** Implement secure resume download action generating signed Supabase Storage URLs[cite: 4].
  - [ ] **Task 10.3:** Wire candidate status update dropdown to database mutation endpoint[cite: 1, 4].

---

## Part 2: Team-Generated & Original User Stories (US-11 to US-15)
*Origin: Conceived, brainstormed, and designed independently by the team to provide unique functionality beyond AI suggestions[cite: 1, 4].*

### US-11 [User Story #11] | Fatmagul Dedek
* **User Story (Original Team Feature):** As a job seeker, I want to evaluate curated job postings via a Tinder-style swipeable card deck, so that I can rapidly save or discard opportunities without search fatigue[cite: 1, 4].
* **Assignee:** `@FatmagulDedek`[cite: 1, 4] | **Priority:** High | **Milestone:** `Sprint 2` / `Sprint 3` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `team-original`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Renders job listings as a deck of gesture-interactive swipe cards[cite: 1, 4].
  - [ ] Swiping right saves the role to the seeker's `saved_jobs` table[cite: 1, 4].
  - [ ] Swiping left dismisses the posting and caches its ID so it is excluded from future deck rotations.
  - [ ] Tapping a card expands it to display full job details, perks, and salary preview[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 11.1:** Build gesture-driven card deck component using Framer Motion (drag gestures, rotation physics)[cite: 4].
  - [ ] **Task 11.2:** Implement database write on swipe-right into `saved_jobs` table[cite: 1, 4].
  - [ ] **Task 11.3:** Implement exclusion filter caching for dismissed cards on swipe-left.
  - [ ] **Task 11.4:** Build expandable modal revealing full job details and requirements on card tap[cite: 1, 4].

---

### US-12 [User Story #12] | Fatmagul Dedek
* **User Story (Mandatory GenAI Feature):** As a job seeker, I want to scan my uploaded resume against an ATS evaluation model, so that I can receive an ATS compatibility score and actionable recommendations to improve it[cite: 1, 4].
* **Assignee:** `@FatmagulDedek`[cite: 1, 4] | **Priority:** Medium | **Milestone:** `Sprint 3` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `team-original`, `ai-feature`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] System extracts text from candidate resume PDF and transmits it to LLM API using an ATS prompt[cite: 1, 4].
  - [ ] Returns composite ATS score (0-100) and metric scores (Structure, Keywords, Clarity, Impact)[cite: 4].
  - [ ] Provides categorized bullet-point feedback with concrete wording suggestions[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 12.1:** Implement backend API route to parse PDF text and query LLM endpoint with ATS evaluation system prompt[cite: 1, 4].
  - [ ] **Task 12.2:** Build ATS score breakdown UI displaying composite score meter and category gauges[cite: 1, 4].
  - [ ] **Task 12.3:** Build UI container displaying actionable bullet-point resume improvement recommendations[cite: 1, 4].

---

### US-13 [User Story #13] | Ahcene Chouyoukh
* **User Story:** As a job seeker, I want to browse external job listings imported via external job APIs (e.g., LinkedIn/Glassdoor data), so that I can track external and internal opportunities in a unified platform[cite: 1, 4].
* **Assignee:** `@AhceneChouyoukh`[cite: 1, 4] | **Priority:** Medium | **Milestone:** `Sprint 3` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `team-original`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Queries an external job aggregator API (e.g., JSearch / Adzuna) and renders listings cleanly[cite: 4].
  - [ ] Provides an "Import to Tracker" action that saves the external role into the seeker's application board[cite: 4].
  - [ ] External listings are visually distinguished with origin badges (e.g., "Source: LinkedIn")[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 13.1:** Create backend caching proxy to query and sanitize external job search API feeds[cite: 4].
  - [ ] **Task 13.2:** Build card UI badge elements identifying external job origin and source links[cite: 4].
  - [ ] **Task 13.3:** Implement "Import to Tracker" action creating manual records on the seeker application board[cite: 1, 4].

---

### US-14 [User Story #14] | Ahcene Chouyoukh
* **User Story:** As a job seeker, I want to receive notification alerts for approaching application closing dates, so that I submit my applications before deadlines expire[cite: 1, 4].
* **Assignee:** `@AhceneChouyoukh`[cite: 1, 4] | **Priority:** Low | **Milestone:** `Sprint 3` / `Sprint 4` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `team-original`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] Identifies saved and open applications whose closing dates fall within 48 hours[cite: 1, 4].
  - [ ] Displays a notification counter badge on the top navigation bar[cite: 1, 4].
  - [ ] Notification popover lists expiring postings with direct navigation links[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 14.1:** Write Supabase query selecting saved jobs with application deadlines occurring within 48 hours[cite: 1, 4].
  - [ ] **Task 14.2:** Build top navigation notification bell UI icon with dynamic active counter badge[cite: 1, 4].
  - [ ] **Task 14.3:** Build reminder popover drawer displaying urgent deadlines and direct link buttons[cite: 1, 4].

---

### US-15 [User Story #15] | Ahcene Chouyoukh
* **User Story:** As a job seeker, I want to save and bookmark interesting job postings into a favorites drawer, so that I can review them together and apply at a later time[cite: 1, 4].
* **Assignee:** `@AhceneChouyoukh`[cite: 1, 4] | **Priority:** Low | **Milestone:** `Sprint 2` | **Status:** Not Started[cite: 1, 4]
* **Labels:** `user-story`, `team-original`, `job-seeker`[cite: 1, 4]
* **Acceptance Criteria:**
  - [ ] All job cards feature an interactive bookmark icon to toggle saved state[cite: 1, 4].
  - [ ] Slide-out drawer or favorites page renders all saved listings for the logged-in seeker[cite: 1, 4].
  - [ ] Each bookmarked role in the drawer includes an inline "Apply Now" trigger[cite: 1, 4].
* **Tasks:**
  - [ ] **Task 15.1:** Create `saved_jobs` junction table in Supabase linking `seeker_id` and `job_id`[cite: 4].
  - [ ] **Task 15.2:** Build interactive bookmark toggle button on all job cards[cite: 1, 4].
  - [ ] **Task 15.3:** Build slide-over favorites drawer displaying bookmarked roles and apply triggers[cite: 1, 4].
