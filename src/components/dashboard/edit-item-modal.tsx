"use client";

import { Button } from "@/components/ui";
import { X } from "lucide-react";
import { type FormEvent } from "react";
import type { StudyItem } from "@/types";

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  item: StudyItem;
  onSubmit: (formData: FormData) => void;
}

export function EditItemModal({
  open,
  onClose,
  item,
  onSubmit,
}: EditItemModalProps) {
  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string)?.trim();
    if (!title) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit item</h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-item-title"
                className="block text-sm font-medium"
              >
                Title
              </label>
              <input
                id="edit-item-title"
                name="title"
                type="text"
                required
                autoFocus
                defaultValue={item.title}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="edit-item-url"
                className="block text-sm font-medium"
              >
                URL (optional)
              </label>
              <input
                id="edit-item-url"
                name="url"
                type="url"
                defaultValue={item.url ?? ""}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://..."
              />
            </div>
            <div>
              <label
                htmlFor="edit-item-notes"
                className="block text-sm font-medium"
              >
                Notes (optional)
              </label>
              <textarea
                id="edit-item-notes"
                name="notes"
                rows={3}
                defaultValue={item.notes ?? ""}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Any extra notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
