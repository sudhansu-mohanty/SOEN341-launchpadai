export type UserRole = "job_seeker" | "recruiter";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  resume_url?: string;
};

export type WorkplaceType = "remote" | "hybrid" | "in_person";

export type JobSource = "launchpad" | "external";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min: number;
  salary_max: number;
  workplace_type: WorkplaceType;
  posted_by: string;
  created_at: string;
  deadline: string; // last day to apply (ISO timestamp)
  source: JobSource; // "launchpad" = posted by a recruiter on LaunchpadAI
  apply_url?: string; // external jobs apply on the original site
};

export type Application = {
  id: string;
  job_id: string;
  applicant_id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
};
