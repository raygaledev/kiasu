import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { Container } from '@/components/ui';
import { StudyListGrid } from '@/components/dashboard/study-list-grid';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const studyLists = await prisma.studyList.findMany({
    where: { userId: user!.id },
    include: { _count: { select: { items: true } } },
    orderBy: { position: 'asc' },
  });

  return (
    <Container as="section" className="py-8">
      <StudyListGrid studyLists={studyLists} />
    </Container>
  );
}
