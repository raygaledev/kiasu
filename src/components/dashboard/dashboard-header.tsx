"use client";

import { Button } from "@/components/ui";
import { CreateStudyListModal } from "./create-study-list-modal";
import { Plus } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  hasLists: boolean;
}

export function DashboardHeader({ hasLists }: DashboardHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Study Lists</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize your study lists
          </p>
        </div>
        {hasLists && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New list
          </Button>
        )}
      </div>

      <CreateStudyListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
