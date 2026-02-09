"use client";

import { Spinner } from "@/components/ui";
import { EditItemModal } from "./edit-item-modal";
import {
  toggleStudyItem,
  deleteStudyItem,
} from "@/app/(app)/dashboard/[slug]/actions";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { StudyItem } from "@/types";

interface StudyItemRowProps {
  item: StudyItem;
  slug: string;
}

export function StudyItemRow({ item, slug }: StudyItemRowProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isBusy = toggling || deleting;

  const handleToggle = async () => {
    setToggling(true);
    const result = await toggleStudyItem(item.id, slug);
    if (result.error) toast.error(result.error);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteStudyItem(item.id, slug);
    if (result.error) {
      toast.error(result.error);
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
        <button
          onClick={handleToggle}
          disabled={isBusy}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-border transition-colors disabled:opacity-50 data-[checked=true]:border-primary data-[checked=true]:bg-primary"
          data-checked={item.completed}
        >
          {toggling ? (
            <Spinner className="h-3 w-3" />
          ) : item.completed ? (
            <svg
              className="h-3 w-3 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {item.title}
          </p>
          {item.notes && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {item.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => setEditOpen(true)}
            disabled={isBusy}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isBusy}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {deleting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <EditItemModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={item}
        slug={slug}
      />
    </>
  );
}
