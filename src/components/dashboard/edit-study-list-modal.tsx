"use client";

import { Button, Spinner } from "@/components/ui";
import {
  updateStudyList,
  deleteStudyList,
} from "@/app/(app)/dashboard/actions";
import { X, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { StudyListWithItemCount } from "@/types";

interface EditStudyListModalProps {
  open: boolean;
  onClose: () => void;
  list: StudyListWithItemCount;
}

export function EditStudyListModal({
  open,
  onClose,
  list,
}: EditStudyListModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const isBusy = loading || deleting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateStudyList(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Study list updated!");
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteStudyList(list.id);

    if (result.error) {
      toast.error(result.error);
      setDeleting(false);
      return;
    }

    toast.success("Study list deleted");
    setDeleting(false);
    setConfirmDelete(false);
    onClose();
  };

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isBusy ? undefined : handleClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit study list</h2>
          <button
            onClick={handleClose}
            disabled={isBusy}
            className="cursor-pointer rounded-lg p-1 hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={list.id} />
          <fieldset disabled={isBusy} className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                required
                autoFocus
                defaultValue={list.title}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium"
              >
                Description (optional)
              </label>
              <textarea
                id="edit-description"
                name="description"
                rows={3}
                defaultValue={list.description ?? ""}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
                placeholder="What is this study list about?"
              />
            </div>
          </fieldset>
          {confirmDelete ? (
            <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                This will permanently delete <strong>{list.title}</strong> and
                all {list._count.items}{" "}
                {list._count.items === 1 ? "item" : "items"} inside it. This
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && <Spinner className="mr-2" />}
                  {deleting ? "Deleting..." : "Yes, delete"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  list._count.items > 0
                    ? setConfirmDelete(true)
                    : handleDelete()
                }
                disabled={isBusy}
                className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isBusy}>
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
