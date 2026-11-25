
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";


type ProfileForm = {
  // job seeker fileds
  full_name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  portfolio_url: string;
  linkedin_url: string;

  // Recruiter fields
  job_title: string;
  company_name: string;
  industry: string;
  company_website: string;
  company_size: string;
  company_description: string;
};



const emptyForm: ProfileForm = {
  // job seeker fields
  full_name: "",
  headline: "",
  location: "",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  portfolio_url: "",
  linkedin_url: "",

  // Recruiter fields
  job_title: "",
  company_name: "",
  industry: "",
  company_website: "",
  company_size: "",
  company_description: "",
};


const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/30";

const labelClass = "mb-2 block text-sm font-medium text-zinc-400";

export default function ProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  const [role, setRole] = useState<"recruiter" | "job_seeker">("job_seeker");

  useEffect(() => {
    async function loadProfile() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      const user = authData.user;
      const userRole =
  user?.user_metadata?.role === "recruiter"
    ? "recruiter"
    : "job_seeker";

setRole(userRole);

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      
if (userRole === "recruiter") {
  const { data, error: profileError } = await supabase
    .from("recruiter_profiles")
    .select(
      "full_name, job_title, company_name, industry, company_website, company_size, company_description, company_location, linkedin_url"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    setError("Could not load recruiter profile: " + profileError.message);
    setLoading(false);
    return;
  }

  if (data) {
    setProfileExists(true);
    setForm({
      ...emptyForm,
      full_name: data.full_name ?? "",
      job_title: data.job_title ?? "",
      company_name: data.company_name ?? "",
      industry: data.industry ?? "",
      company_website: data.company_website ?? "",
      company_size: data.company_size ?? "",
      company_description: data.company_description ?? "",
      location: data.company_location ?? "",
      linkedin_url: data.linkedin_url ?? "",
    });
  } else {
    setForm({
      ...emptyForm,
      full_name: user.user_metadata?.full_name ?? "",
    });
  }
} else {
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select(
      "full_name, headline, location, summary, skills, education, experience, portfolio_url, linkedin_url"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    setError("Could not load your profile. Check that the database table is configured.");
    setLoading(false);
    return;
  }

  if (data) {
    setProfileExists(true);
    setForm({
      ...emptyForm,
      full_name: data.full_name ?? "",
      headline: data.headline ?? "",
      location: data.location ?? "",
      summary: data.summary ?? "",
      skills: (data.skills ?? []).join(", "),
      education: data.education ?? "",
      experience: data.experience ?? "",
      portfolio_url: data.portfolio_url ?? "",
      linkedin_url: data.linkedin_url ?? "",
    });
  } else {
    setForm({
      ...emptyForm,
      full_name: user.user_metadata?.full_name ?? "",
    });
  }
}


      setLoading(false);
    }

    void loadProfile();
  }, [router]);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!userId) {
      setError("You must be logged in to save a profile.");
      return;
    }

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    
const urls =
  role === "recruiter"
    ? [form.company_website, form.linkedin_url]
    : [form.portfolio_url, form.linkedin_url];

if (
  urls.some(
    (url) => url.trim() && !/^https?:\/\/\S+$/i.test(url.trim())
  )
) {
  setError("All links must start with http:// or https://.");
  return;
}


    
setSaving(true);

if (role === "recruiter") {
  const { error: saveError } = await supabase
    .from("recruiter_profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: form.full_name.trim(),
        job_title: form.job_title.trim(),
        company_name: form.company_name.trim(),
        industry: form.industry.trim(),
        company_website: form.company_website.trim(),
        company_location: form.location.trim(),
        company_size: form.company_size,
        company_description: form.company_description.trim(),
        linkedin_url: form.linkedin_url.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  setSaving(false);

  if (saveError) {
    setError("Could not save recruiter profile: " + saveError.message);
    return;
  }
} else {
  const { error: saveError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: form.full_name.trim(),
        headline: form.headline.trim(),
        location: form.location.trim(),
        summary: form.summary.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        education: form.education.trim(),
        experience: form.experience.trim(),
        portfolio_url: form.portfolio_url.trim(),
        linkedin_url: form.linkedin_url.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  setSaving(false);

  if (saveError) {
    setError("Could not save your profile: " + saveError.message);
    return;
  }
}

setProfileExists(true);
setMessage("Your profile has been saved.");

  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-24">
        
<div className="mb-8">
  <p className="text-sm font-medium text-zinc-500">
    {role === "recruiter" ? "RECRUITER" : "JOB SEEKER"}
  </p>

  <h1 className="mt-2 text-3xl font-bold tracking-tight">
    {role === "recruiter" ? "Recruiter profile" : "Professional profile"}
  </h1>

  <p className="mt-3 text-sm text-zinc-400">
    {role === "recruiter"
      ? "Introduce yourself and your company to potential candidates."
      : "Share your experience, education, and skills with potential employers."}
  </p>
</div>


        {loading ? (
          <p className="text-sm text-zinc-400">Loading your profile...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <div>
              <h2 className="text-lg font-semibold">Basic information</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your account email is shown for reference.
              </p>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Account email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
            </div>

            <div>
              <label htmlFor="full_name" className={labelClass}>
                Full name *
              </label>
              <input
                id="full_name"
                required
                maxLength={100}
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>

            ---
{role === "recruiter" ? (
  <>
    <div>
      <h2 className="text-lg font-semibold">Professional information</h2>
    </div>

    <div>
      <label htmlFor="job_title" className={labelClass}>
        Job title
      </label>
      <input
        id="job_title"
        value={form.job_title}
        onChange={(e) => updateField("job_title", e.target.value)}
        placeholder="Talent Acquisition Specialist"
        className={inputClass}
      />
    </div>

    <div>
      <label htmlFor="linkedin_url" className={labelClass}>
        LinkedIn URL
      </label>
      <input
        id="linkedin_url"
        type="url"
        value={form.linkedin_url}
        onChange={(e) => updateField("linkedin_url", e.target.value)}
        placeholder="https://linkedin.com/in/username"
        className={inputClass}
      />
    </div>

    <div>
      <h2 className="text-lg font-semibold">Company information</h2>
    </div>

    <div>
      <label htmlFor="company_name" className={labelClass}>
        Company name
      </label>
      <input
        id="company_name"
        value={form.company_name}
        onChange={(e) => updateField("company_name", e.target.value)}
        placeholder="ABC Technologies"
        className={inputClass}
      />
    </div>

    <div>
      <label htmlFor="industry" className={labelClass}>
        Industry
      </label>
      <input
        id="industry"
        value={form.industry}
        onChange={(e) => updateField("industry", e.target.value)}
        placeholder="Information Technology"
        className={inputClass}
      />
    </div>

    <div>
      <label htmlFor="company_website" className={labelClass}>
        Company website
      </label>
      <input
        id="company_website"
        type="url"
        value={form.company_website}
        onChange={(e) => updateField("company_website", e.target.value)}
        placeholder="https://www.company.com"
        className={inputClass}
      />
    </div>

    <div>
      <label htmlFor="location" className={labelClass}>
        Company location
      </label>
      <input
        id="location"
        value={form.location}
        onChange={(e) => updateField("location", e.target.value)}
        placeholder="Montreal, Quebec"
        className={inputClass}
      />
    </div>

    <div>
      <label htmlFor="company_size" className={labelClass}>
        Company size
      </label>
      <select
        id="company_size"
        value={form.company_size}
        onChange={(e) => updateField("company_size", e.target.value)}
        className={inputClass}
      >
        <option value="">Select company size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="501-1000">501-1000 employees</option>
        <option value="1000+">1000+ employees</option>
      </select>
    </div>

    <div>
      <label htmlFor="company_description" className={labelClass}>
        Company description
      </label>
      <textarea
        id="company_description"
        rows={5}
        maxLength={2000}
        value={form.company_description}
        onChange={(e) => updateField("company_description", e.target.value)}
        placeholder="Tell candidates about your company."
        className={inputClass}
      />
    </div>
  </>
) : (
  <>
    <div>
              <label htmlFor="headline" className={labelClass}>
                Professional headline
              </label>
              <input
                id="headline"
                maxLength={150}
                value={form.headline}
                onChange={(e) => updateField("headline", e.target.value)}
                placeholder="Software Engineering Student"
                className={inputClass}
              />
            </div>
    <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                maxLength={150}
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Montreal, Quebec"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="summary" className={labelClass}>
                Professional summary
              </label>
              <textarea
                id="summary"
                rows={5}
                maxLength={2000}
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder="Briefly describe your background and career goals."
                className={inputClass}
              />
            </div>

  <div>
              <h2 className="text-lg font-semibold">Skills and experience</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Separate skills with commas.
              </p>
            </div>

            <div>
              <label htmlFor="skills" className={labelClass}>
                Skills
              </label>
              <input
                id="skills"
                maxLength={1000}
                value={form.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                placeholder="Java, Python, SQL, Git"
                className={inputClass}
              />
            </div>

      <div>
              <label htmlFor="education" className={labelClass}>
                Education
              </label>
              <textarea
                id="education"
                rows={3}
                maxLength={2000}
                value={form.education}
                onChange={(e) => updateField("education", e.target.value)}
                placeholder="Degree, institution, and graduation year"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="experience" className={labelClass}>
                Work experience and projects
              </label>
              <textarea
                id="experience"
                rows={5}
                maxLength={4000}
                value={form.experience}
                onChange={(e) => updateField("experience", e.target.value)}
                placeholder="Describe relevant roles, responsibilities, and projects."
                className={inputClass}
              />
            </div>

      <div>
              <h2 className="text-lg font-semibold">Professional links</h2>
            </div>

            <div>
              <label htmlFor="portfolio_url" className={labelClass}>
                Portfolio or GitHub URL
              </label>
              <input
                id="portfolio_url"
                type="url"
                maxLength={500}
                value={form.portfolio_url}
                onChange={(e) => updateField("portfolio_url", e.target.value)}
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>

      <div>
              <label htmlFor="linkedin_url" className={labelClass}>
                LinkedIn URL
              </label>
              <input
                id="linkedin_url"
                type="url"
                maxLength={500}
                value={form.linkedin_url}
                onChange={(e) => updateField("linkedin_url", e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className={inputClass}
              />
            </div>

  }
  </>
)
            {error && (
              <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg bg-green-500/10 p-3 text-sm text-green-300">
                {message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : profileExists
                    ? "Save changes"
                    : "Create profile"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                Back to dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
