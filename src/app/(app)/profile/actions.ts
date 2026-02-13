'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';

export async function getProfilePicture() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { profilePictureUrl: true },
  });

  return dbUser?.profilePictureUrl ?? null;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function uploadProfilePicture(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (file.size > MAX_SIZE) {
    return { error: 'Image must be under 2 MB' };
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const filePath = `${user.id}/${Date.now()}.${ext}`;

  // Delete previous uploads for this user
  const { data: existing } = await supabase.storage
    .from('profile-pictures')
    .list(user.id);

  if (existing?.length) {
    await supabase.storage
      .from('profile-pictures')
      .remove(existing.map((f) => `${user.id}/${f.name}`));
  }

  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: 'Upload failed. Please try again.' };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);

  await prisma.user.update({
    where: { id: user.id },
    data: { profilePictureUrl: publicUrl },
  });

  revalidatePath('/profile');
  return { success: true, url: publicUrl };
}
