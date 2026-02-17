'use client';

import { createElement } from 'react';
import { CATEGORIES } from '@/lib/categories';

interface DiscoveryCategoryFilterProps {
  active: string | null;
  onChange: (category: string | null) => void;
}

export function DiscoveryCategoryFilter({
  active,
  onChange,
}: DiscoveryCategoryFilterProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 ${
          !active
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
        }`}
      >
        All
      </button>
      {CATEGORIES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 ${
            active === value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {createElement(icon, { className: 'h-3.5 w-3.5' })}
          {label}
        </button>
      ))}
    </div>
  );
}
