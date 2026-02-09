"use client";

import { Card } from "@/components/ui";
import { EditStudyListModal } from "./edit-study-list-modal";
import { BookOpen, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { StudyListWithItemCount } from "@/types";

interface StudyListCardProps {
  list: StudyListWithItemCount;
}

export function StudyListCard({ list }: StudyListCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <Link
            href={`/dashboard/${list.slug}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{list.title}</h3>
          </Link>
          <button
            onClick={() => setEditOpen(true)}
            className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {list.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {list.description}
          </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          {list._count.items} {list._count.items === 1 ? "item" : "items"}
        </p>
      </Card>

      <EditStudyListModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        list={list}
      />
    </>
  );
}
