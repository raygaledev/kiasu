"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { Avatar } from "@/components/ui";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const name =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email;
  const avatarUrl = user.user_metadata?.avatar_url ?? null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar src={avatarUrl} name={name} size="sm" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-lg">
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
