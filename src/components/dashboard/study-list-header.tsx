"use client";

import { Button } from "@/components/ui";
import { CreateItemModal } from "./create-item-modal";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StudyListHeaderProps {
  title: string;
  description: string | null;
  studyListId: string;
  slug: string;
}

export function StudyListHeader({
  title,
  description,
  studyListId,
  slug,
}: StudyListHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to lists
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New item
        </Button>
      </div>

      <CreateItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        studyListId={studyListId}
        slug={slug}
      />
    </>
  );
}
