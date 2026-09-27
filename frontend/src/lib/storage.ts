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

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    id: path,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    url: urlData.publicUrl,
  };
}

export async function listResumes(userId: string): Promise<StoredResume[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(userId, { sortBy: { column: "created_at", order: "desc" } });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data
    .filter((f) => f.name.toLowerCase().endsWith(".pdf"))
    .map((f) => {
      const path = userPath(userId, f.name);
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      return {
        id: path,
        name: f.name,
        size: f.metadata?.size ?? 0,
        uploadedAt: f.created_at ?? "",
        url: urlData.publicUrl,
      };
    });
}

export async function deleteResume(userId: string, filename: string): Promise<void> {
  const path = userPath(userId, filename);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
