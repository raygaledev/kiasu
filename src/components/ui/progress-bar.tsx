'use client';

import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isComplete = clamped === 100;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
        {label && <span>{label}</span>}
        <span className="ml-auto">{clamped}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
