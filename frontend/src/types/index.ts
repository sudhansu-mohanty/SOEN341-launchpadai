export type UserRole = "job_seeker" | "recruiter";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  resume_url?: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  posted_by: string;
  created_at: string;
};

import type { ApplicationStatus } from "@/lib/applications";

export type { ApplicationStatus };

// Row in the applications table (database/applications.sql)
export type Application = {
  id: string;
  job_id: string;
  seeker_id: string;
  resume_path: string;
  cover_note: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};
