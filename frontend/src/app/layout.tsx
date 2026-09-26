import "./globals.css";
import type { ReactNode } from "react";
import { ScoreProvider } from "@/context/ScoreContext";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased">
        <ScoreProvider>{children}</ScoreProvider>
      </body>
    </html>
  );
}
