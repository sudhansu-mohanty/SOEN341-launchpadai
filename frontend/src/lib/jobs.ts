import type { Job, WorkplaceType } from "@/types";

// Placeholder listings until jobs are loaded from Supabase.
export const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Shopify",
    location: "Montreal, QC",
    description: "Build merchant-facing features with React and TypeScript.",
    salary_min: 85000,
    salary_max: 110000,
    workplace_type: "hybrid",
    posted_by: "recruiter-1",
    created_at: "2026-10-10T14:00:00Z",
  },
  {
    id: "2",
    title: "Junior Software Engineer",
    company: "Ubisoft",
    location: "Montreal, QC",
    description: "Work on internal tools for game production teams.",
    salary_min: 60000,
    salary_max: 75000,
    workplace_type: "in_person",
    posted_by: "recruiter-2",
    created_at: "2026-10-08T09:30:00Z",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Wealthsimple",
    location: "Toronto, ON",
    description: "Ship features across our Next.js frontend and Node services.",
    salary_min: 95000,
    salary_max: 130000,
    workplace_type: "remote",
    posted_by: "recruiter-3",
    created_at: "2026-10-12T16:15:00Z",
  },
  {
    id: "4",
    title: "Data Analyst Intern",
    company: "Desjardins",
    location: "Quebec City, QC",
    description: "Analyze customer data and build dashboards for business teams.",
    salary_min: 40000,
    salary_max: 50000,
    workplace_type: "hybrid",
    posted_by: "recruiter-4",
    created_at: "2026-10-05T11:00:00Z",
  },
  {
    id: "5",
    title: "Backend Engineer",
    company: "Lightspeed",
    location: "Montreal, QC",
    description: "Design APIs and services for point-of-sale systems.",
    salary_min: 100000,
    salary_max: 135000,
    workplace_type: "hybrid",
    posted_by: "recruiter-5",
    created_at: "2026-10-11T13:45:00Z",
  },
  {
    id: "6",
    title: "QA Automation Engineer",
    company: "CGI",
    location: "Ottawa, ON",
    description: "Write automated test suites for government client projects.",
    salary_min: 70000,
    salary_max: 90000,
    workplace_type: "in_person",
    posted_by: "recruiter-6",
    created_at: "2026-10-03T10:20:00Z",
  },
  {
    id: "7",
    title: "Machine Learning Engineer",
    company: "Cohere",
    location: "Toronto, ON",
    description: "Train and evaluate language models for enterprise customers.",
    salary_min: 130000,
    salary_max: 170000,
    workplace_type: "remote",
    posted_by: "recruiter-7",
    created_at: "2026-10-09T15:00:00Z",
  },
  {
    id: "8",
    title: "Mobile Developer",
    company: "Hopper",
    location: "Vancouver, BC",
    description: "Build travel booking features in React Native.",
    salary_min: 90000,
    salary_max: 115000,
    workplace_type: "remote",
    posted_by: "recruiter-8",
    created_at: "2026-10-07T12:00:00Z",
  },
];

export const WORKPLACE_LABELS: Record<WorkplaceType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  in_person: "In-person",
};

export const SALARY_RANGES = [
  { label: "Any salary", min: 0, max: Infinity },
  { label: "Under $60k", min: 0, max: 60000 },
  { label: "$60k – $90k", min: 60000, max: 90000 },
  { label: "$90k – $120k", min: 90000, max: 120000 },
  { label: "$120k+", min: 120000, max: Infinity },
];

export type SortOption = "newest" | "salary_high" | "salary_low";

export type JobFilters = {
  search: string;
  location: string; // "" means any location
  salaryRange: number; // index into SALARY_RANGES
  workplaceTypes: WorkplaceType[]; // empty means any type
  sort: SortOption;
};

export const DEFAULT_FILTERS: JobFilters = {
  search: "",
  location: "",
  salaryRange: 0,
  workplaceTypes: [],
  sort: "newest",
};

export function getLocations(jobs: Job[]): string[] {
  return Array.from(new Set(jobs.map((job) => job.location))).sort();
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const query = filters.search.trim().toLowerCase();
  const range = SALARY_RANGES[filters.salaryRange];

  const matches = jobs.filter((job) => {
    if (
      query &&
      ![job.title, job.company, job.description].some((field) =>
        field.toLowerCase().includes(query)
      )
    ) {
      return false;
    }
    if (filters.location && job.location !== filters.location) return false;
    // A job matches when its salary band overlaps the selected range.
    if (job.salary_max <= range.min || job.salary_min >= range.max) return false;
    if (
      filters.workplaceTypes.length > 0 &&
      !filters.workplaceTypes.includes(job.workplace_type)
    ) {
      return false;
    }
    return true;
  });

  return matches.sort((a, b) => {
    if (filters.sort === "salary_high") return b.salary_max - a.salary_max;
    if (filters.sort === "salary_low") return a.salary_min - b.salary_min;
    return b.created_at.localeCompare(a.created_at);
  });
}

export function formatSalary(min: number, max: number): string {
  const k = (n: number) => `$${Math.round(n / 1000)}k`;
  return `${k(min)} – ${k(max)}`;
}

export type JobDetails = {
  employmentType: string;
  experience: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

// Dummy details until full postings are loaded from Supabase.
export function getJobDetails(job: Job): JobDetails {
  return {
    employmentType: job.title.toLowerCase().includes("intern") ? "Internship" : "Full-time",
    experience: job.title.toLowerCase().includes("junior") ? "0–2 years" : "2–5 years",
    about: `${job.company} is looking for a ${job.title} to join the team in ${job.location}. ${job.description} You will collaborate closely with designers, product managers and fellow engineers in a supportive, fast-moving environment.`,
    responsibilities: [
      "Design, build and maintain high-quality features from planning to release",
      "Collaborate with cross-functional teammates to define and ship new work",
      "Review code, share knowledge and help raise the engineering bar",
      "Monitor performance and quality, and fix issues quickly",
    ],
    requirements: [
      "Degree in Computer Science, Software Engineering or equivalent experience",
      "Strong problem-solving and communication skills",
      "Comfortable working with Git and modern development workflows",
      "Eagerness to learn and take ownership",
    ],
    benefits: [
      "Extended health and dental coverage",
      "Flexible vacation and personal days",
      "Learning and development budget",
      "Employee share or savings plan",
    ],
  };
}
