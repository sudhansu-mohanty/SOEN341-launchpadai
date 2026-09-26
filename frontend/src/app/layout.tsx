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
  title: "LaunchPadAI — Job Search & Application Tracking",
  description:
    "Manage your job search, upload resumes, track applications, and get AI-powered career insights.",
  openGraph: {
    title: "LaunchPadAI — Job Search & Application Tracking",
    description:
      "Your all-in-one platform for job search, resume management, and application tracking.",
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
