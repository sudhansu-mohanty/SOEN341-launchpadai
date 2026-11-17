export type PostingForm = {
  title: string;
  company: string;
  location: string;
  workplace_type: string;
  description: string;
  deadline: string;
};

export type PostingErrors = Partial<Record<keyof PostingForm, string>>;

// Today's date in the viewer's local time, as YYYY-MM-DD.
export function todayString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function validatePosting(form: PostingForm, now: Date = new Date()): PostingErrors {
  const errors: PostingErrors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.company.trim()) errors.company = "Company is required.";
  if (!form.location.trim()) errors.location = "Location is required.";
  if (!form.workplace_type) errors.workplace_type = "Choose a job type.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (form.deadline && form.deadline < todayString(now)) {
    errors.deadline = "The deadline cannot be in the past.";
  }
  return errors;
}