'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { MoreVertical, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminHideList, adminDeleteList } from '@/app/discovery/actions';

interface AdminActionsMenuProps {
  listId: string;
}

export function AdminActionsMenu({ listId }: AdminActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  function handleHide() {
    startTransition(async () => {
      const result = await adminHideList(listId);
      if (result.error) toast.error(result.error);
      else toast.success('Learning path hidden');
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!confirm('Permanently delete this learning path?')) return;
    startTransition(async () => {
      const result = await adminDeleteList(listId);
      if (result.error) toast.error(result.error);
      else toast.success('Learning path deleted');
      setOpen(false);
    });
  }

  return (
    <div ref={menuRef} className="relative z-20">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Admin actions"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
          <button
            onClick={handleHide}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <EyeOff className="h-3.5 w-3.5" />
            Hide
          </button>
          <button
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
