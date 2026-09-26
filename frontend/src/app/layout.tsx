import "./globals.css";
import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { ScoreProvider } from "@/context/ScoreContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "LaunchPad — AI Resume Feedback",
  description:
    "Get ATS-style scoring and clarity feedback on your resume in seconds. Built for fast, recruiter-ready iteration.",
  openGraph: {
    title: "LaunchPad — AI Resume Feedback",
    description:
      "Upload your resume and get ATS scoring, keyword gaps, and clarity improvements instantly.",
    type: "website",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="bg-black text-white antialiased">
        <ScoreProvider>{children}</ScoreProvider>
      </body>
    </html>
  );
}
