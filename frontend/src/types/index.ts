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

export type Application = {
  id: string;
  job_id: string;
  applicant_id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
};
