import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { Container } from "@/components/ui";
import { StudyListHeader } from "@/components/dashboard/study-list-header";
import { StudyItemRow } from "@/components/dashboard/study-item-row";
import { ItemsEmptyState } from "@/components/dashboard/items-empty-state";
import { notFound } from "next/navigation";

export default async function StudyListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const studyList = await prisma.studyList.findFirst({
    where: { slug, userId: user!.id },
    include: {
      items: { orderBy: { position: "asc" } },
    },
  });

  if (!studyList) {
    notFound();
  }

  return (
    <Container as="section" className="py-8">
      <StudyListHeader
        title={studyList.title}
        description={studyList.description}
        studyListId={studyList.id}
        slug={slug}
      />

      <div className="mt-8">
        {studyList.items.length === 0 ? (
          <ItemsEmptyState studyListId={studyList.id} slug={slug} />
        ) : (
          <div className="space-y-2">
            {studyList.items.map((item) => (
              <StudyItemRow key={item.id} item={item} slug={slug} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
