"use client";

import { Button, Spinner } from "@/components/ui";
import { createStudyItem } from "@/app/(app)/dashboard/[slug]/actions";
import { X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
  studyListId: string;
  slug: string;
}

export function CreateItemModal({
  open,
  onClose,
  studyListId,
  slug,
}: CreateItemModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createStudyItem(studyListId, slug, formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Item added!");
    formRef.current?.reset();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add item</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-lg p-1 hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label htmlFor="item-title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="item-title"
                name="title"
                type="text"
                required
                autoFocus
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="e.g. Read Chapter 3"
              />
            </div>
            <div>
              <label htmlFor="item-url" className="block text-sm font-medium">
                URL (optional)
              </label>
              <input
                id="item-url"
                name="url"
                type="url"
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="item-notes" className="block text-sm font-medium">
                Notes (optional)
              </label>
              <textarea
                id="item-notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
                placeholder="Any extra notes..."
              />
            </div>
          </fieldset>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading ? "Adding..." : "Add item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
