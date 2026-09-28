import { supabase } from "./supabase";

const BUCKET = "resumes";

export type StoredResume = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
};

function userPath(userId: string, filename: string) {
  return `${userId}/${filename}`;
}

export async function uploadResume(userId: string, file: File): Promise<StoredResume> {
  const path = userPath(userId, file.name);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data: urlData, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (urlError || !urlData?.signedUrl) throw new Error("Failed to generate URL");

  return {
    id: path,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    url: urlData.signedUrl,
  };
}

export async function listResumes(userId: string): Promise<StoredResume[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(userId, { sortBy: { column: "created_at", order: "desc" } });

  if (error) throw new Error(error.message);
  if (!data) return [];

  const pdfs = data.filter((f) => f.name.toLowerCase().endsWith(".pdf"));

  return Promise.all(
    pdfs.map(async (f) => {
      const path = userPath(userId, f.name);
      const { data: urlData } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60);

      return {
        id: path,
        name: f.name,
        size: f.metadata?.size ?? 0,
        uploadedAt: f.created_at ?? "",
        url: urlData?.signedUrl ?? "",
      };
    })
  );
}

export async function deleteResume(userId: string, filename: string): Promise<void> {
  const path = userPath(userId, filename);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
