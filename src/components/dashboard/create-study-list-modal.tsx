"use client";

import { Button, Spinner } from "@/components/ui";
import { createStudyList } from "@/app/(app)/dashboard/actions";
import { X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

interface CreateStudyListModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateStudyListModal({
  open,
  onClose,
}: CreateStudyListModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createStudyList(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Study list created!");
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
          <h2 className="text-lg font-semibold">Create study list</h2>
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
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                autoFocus
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="e.g. React Fundamentals"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
                placeholder="What is this study list about?"
              />
            </div>
          </fieldset>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
