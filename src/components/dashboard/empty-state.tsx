"use client";

import { Button } from "@/components/ui";
import { CreateStudyListModal } from "./create-study-list-modal";
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";

export function EmptyState() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No study lists yet</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Create your first study list to start organizing your learning
          journey.
        </p>
        <Button className="mt-6" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create study list
        </Button>
      </div>

      <CreateStudyListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
