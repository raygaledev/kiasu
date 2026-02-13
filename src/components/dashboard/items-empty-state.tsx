'use client';

import { Button } from '@/components/ui';
import { ClipboardList, Plus } from 'lucide-react';

interface ItemsEmptyStateProps {
  onCreateClick: () => void;
}

export function ItemsEmptyState({ onCreateClick }: ItemsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <ClipboardList className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Add your first item to start tracking your progress.
      </p>
      <Button className="mt-6" onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}
