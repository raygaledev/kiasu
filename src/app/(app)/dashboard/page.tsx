import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { Container } from "@/components/ui";
import { StudyListCard } from "@/components/dashboard";
import { EmptyState } from "@/components/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const studyLists = await prisma.studyList.findMany({
    where: { userId: user!.id },
    include: { _count: { select: { items: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <Container as="section" className="py-8">
      <DashboardHeader hasLists={studyLists.length > 0} />

      <div className="mt-8">
        {studyLists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studyLists.map((list) => (
              <StudyListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
