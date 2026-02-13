import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card py-4 px-5 shadow-sm transition-all duration-200 hover:border-border",
        className,
      )}
      {...props}
    />
  );
}
