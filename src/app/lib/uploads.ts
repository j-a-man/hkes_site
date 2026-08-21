import { supabase } from './supabase';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

// Uploads to a bucket and returns both the storage path (needed for private
// buckets, where a signed URL must be minted per-view) and the public URL
// (usable directly for public buckets like avatars/site-images/graphics).
export async function uploadFile(bucket: string, file: File, pathPrefix = ''): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${pathPrefix ? pathPrefix + '/' : ''}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// For private buckets (receipts): mint a short-lived signed URL to view a file.
export async function getSignedUrl(bucket: string, path: string, expiresInSeconds = 120): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
