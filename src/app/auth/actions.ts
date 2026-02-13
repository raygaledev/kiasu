'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { usernameSchema } from '@/lib/validations/schemas';

export async function checkUsernameAvailability(username: string) {
  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return {
      available: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid username',
    };
  }

  const existing = await prisma.user.findFirst({
    where: { username: { equals: parsed.data, mode: 'insensitive' } },
  });

  return { available: !existing, error: null };
}

export async function resolveUsernameToEmail(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username: { equals: username.toLowerCase(), mode: 'insensitive' },
    },
    select: { email: true },
  });

  if (!user) {
    return { email: null, error: 'No account found with that username' };
  }

  return { email: user.email, error: null };
}

export async function setUsername(username: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid username' };
  }

  const existing = await prisma.user.findFirst({
    where: {
      username: { equals: parsed.data, mode: 'insensitive' },
      id: { not: user.id },
    },
  });

  if (existing) {
    return { error: 'Username is already taken' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { username: parsed.data },
  });

  // Also update Supabase user_metadata so it stays in sync
  await supabase.auth.updateUser({
    data: { username: parsed.data },
  });

  return { success: true };
}
