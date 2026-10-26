export type UserRole = "job_seeker" | "recruiter";


export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  resume_url?: string;

  headline: string;
  location: string;
  summary: string;
  skills: string[];
  education: string;
  experience: string;
  portfolio_url: string;
  linkedin_url: string;
  updated_at: string;
};

export type WorkplaceType = "remote" | "hybrid" | "in_person";

export type JobSource = "launchpad" | "external";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  workplace_type: WorkplaceType;
  posted_by: string;
  created_at: string;
  deadline?: string; // last day to apply (ISO timestamp); external listings often don't have one
  source: JobSource; // "launchpad" = posted by a recruiter on LaunchpadAI
  apply_url?: string; // external jobs apply on the original site
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
