
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type ProfileForm = {
  full_name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  portfolio_url: string;
  linkedin_url: string;
};

const emptyForm: ProfileForm = {
  full_name: "",
  headline: "",
  location: "",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  portfolio_url: "",
  linkedin_url: "",
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

  useEffect(() => {
    async function loadProfile() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      const user = authData.user;

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, headline, location, summary, skills, education, experience, portfolio_url, linkedin_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(
          "Could not load your profile. Check that the database table is configured."
        );
        setLoading(false);
        return;
      }

      if (data) {
        setProfileExists(true);
        setForm({
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
        // Use the name collected during account registration.
        setForm({
          ...emptyForm,
          full_name: user.user_metadata?.full_name ?? "",
        });
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

    if (
      (form.portfolio_url && !/^https?:\/\/\S+$/i.test(form.portfolio_url)) ||
      (form.linkedin_url && !/^https?:\/\/\S+$/i.test(form.linkedin_url))
    ) {
      setError("Portfolio and LinkedIn links must start with http:// or https://.");
      return;
    }

    setSaving(true);

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
      setError("Could not save your profile. " + saveError.message);
      return;
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
            JOB SEEKER
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Professional profile
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Share your experience, education, and skills with potential
            employers.
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
