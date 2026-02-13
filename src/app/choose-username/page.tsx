import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { redirect } from 'next/navigation';
import { ChooseUsernameForm } from '@/components/auth';

export default async function ChooseUsernamePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // If user already has a username, send them to the dashboard
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { username: true },
  });

  if (dbUser?.username) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <ChooseUsernameForm />
    </div>
  );
}
