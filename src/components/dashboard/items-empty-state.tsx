"use client";

import { Button } from "@/components/ui";
import { CreateItemModal } from "./create-item-modal";
import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";

interface ItemsEmptyStateProps {
  studyListId: string;
  slug: string;
}

export function ItemsEmptyState({ studyListId, slug }: ItemsEmptyStateProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Add your first item to start tracking your progress.
        </p>
        <Button className="mt-6" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add item
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
