import type { SupabaseClient } from '@supabase/supabase-js';

export async function uploadPhotos(
  sb: SupabaseClient,
  files: File[],
  userId: string
): Promise<string[]> {
  const urls: string[] = [];
  const bucket = 'photos';
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `${userId}/${i}-${file.name}`;
    try {
      const { error } = await sb.storage.from(bucket).upload(path, file, {
        upsert: true,
      });
      if (!error) {
        const { data } = sb.storage.from(bucket).getPublicUrl(path);
        if (data?.publicUrl) urls.push(data.publicUrl);
      }
    } catch (err) {
      console.warn('[uploadPhotos] failed', err);
    }
  }
  return urls;
}
