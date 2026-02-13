import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Ensure user exists in our database
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email!,
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    },
    create: {
      id: user.id,
      email: user.email!,
      username: user.user_metadata?.username ?? null,
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    },
    select: { username: true },
  });

  if (!dbUser.username) {
    redirect('/choose-username');
  }

  return <>{children}</>;
}
