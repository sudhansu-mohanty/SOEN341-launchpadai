"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ScoreData = {
  filename: string;
  score: number;
  skills_score: number;
  experience_score: number;
  projects_score: number;
  education_score: number;
  impact_score: number;
  formatting_score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  highlights: string[];
  analysis: {
    email: string | null;
    phone: string | null;
    skills: string[];
    experience_preview: string;
    education_preview: string;
  };
  structured_resume: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: unknown[];
    experience: unknown[];
    certification: unknown[];
  };
  raw_text: string;
};

type ScoreContextType = {
  data: ScoreData | null;
  setData: (data: ScoreData) => void;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// TODO: Remove mock data before production
const MOCK_DATA: ScoreData = {
  filename: "Sudhansu_Mohanty_Resume.pdf",
  score: 74,
  skills_score: 21,
  experience_score: 18,
  projects_score: 16,
  education_score: 8,
  impact_score: 5,
  formatting_score: 6,
  strengths: [
    "Strong technical skill set with modern web technologies",
    "Clear section hierarchy — easy for ATS parsers to read",
    "Relevant project experience demonstrates hands-on ability",
    "Education section is well-structured with GPA included",
  ],
  weaknesses: [
    "Bullet points lack quantified impact — add metrics like % improvement or user counts",
    "No summary or objective statement at the top",
    "Work experience section could use stronger action verbs",
    "Missing keywords for target roles — tailor to each job description",
    "Certifications section is empty — add relevant ones if available",
  ],
  summary: "Resume extracted and analyzed successfully.",
  highlights: [
    "Email detected: sudhansu@example.com",
    "Phone detected: +1 555-123-4567",
    "Resume content successfully parsed",
  ],
  analysis: {
    email: "sudhansu@example.com",
    phone: "+1 555-123-4567",
    skills: ["python", "react", "node", "typescript", "docker", "aws", "sql"],
    experience_preview:
      "software engineer at techcorp inc. developed and maintained full-stack web applications using react, node.js, and postgresql...",
    education_preview:
      "bachelor of technology in computer science, xyz university, 2020. gpa: 3.7/4.0",
  },
  structured_resume: {
    name: "Sudhansu Mohanty",
    email: "sudhansu@example.com",
    phone: "+1 555-123-4567",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Redis",
      "Git",
      "Tailwind CSS",
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "XYZ University",
        year: "2018 – 2022",
      },
    ],
    experience: [
      {
        title: "Software Engineer",
        company: "TechCorp Inc.",
        duration: "Jun 2022 – Present",
        description:
          "Developed and maintained full-stack web applications serving 50k+ monthly users.",
        responsibilities: [
          "Built RESTful APIs with FastAPI and Node.js, reducing response times by 40%",
          "Designed and implemented React-based dashboards for internal analytics",
          "Set up CI/CD pipelines with GitHub Actions and Docker",
          "Collaborated with product and design teams in agile sprints",
        ],
      },
      {
        title: "Frontend Developer Intern",
        company: "StartupXYZ",
        duration: "Jan 2022 – May 2022",
        description:
          "Contributed to the customer-facing web app during a high-growth phase.",
        responsibilities: [
          "Implemented responsive UI components with React and Tailwind CSS",
          "Integrated third-party APIs for payment and notification services",
          "Participated in code reviews and pair programming sessions",
        ],
      },
    ],
    certification: [
      "AWS Cloud Practitioner",
      "Meta Front-End Developer Certificate",
    ],
  },
  raw_text: "",
};

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ScoreData | null>(MOCK_DATA);
  return (
    <ScoreContext.Provider value={{ data, setData }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
