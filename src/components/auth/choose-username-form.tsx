"use client";

import { Card, Button } from "@/components/ui";
import { chooseUsernameSchema } from "@/lib/validations/schemas";
import { checkUsernameAvailability, setUsername } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { toast } from "sonner";

export function ChooseUsernameForm() {
  const router = useRouter();
  const [username, setUsernameValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleUsernameChange = (value: string) => {
    setUsernameValue(value);
    if (value.length >= 3) {
      setUsernameStatus("checking");
    } else {
      setUsernameStatus("idle");
    }
  };

  useEffect(() => {
    if (username.length < 3) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const result = await checkUsernameAvailability(username);
      if (result.error) {
        setUsernameStatus("idle");
        setError(result.error);
      } else {
        setUsernameStatus(result.available ? "available" : "taken");
        setError(null);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = chooseUsernameSchema.safeParse({ username });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid username");
      return;
    }

    if (usernameStatus === "taken") {
      setError("Username is already taken");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await setUsername(parsed.data.username);
    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose a username</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a unique username for your Kiasu profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username <span className="text-destructive">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className={`mt-1 block w-full rounded-xl border ${error ? "border-destructive" : "border-border/50"} bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`}
            placeholder="cool_username"
            autoFocus
          />
          {usernameStatus === "checking" && (
            <p className="mt-1 text-xs text-muted-foreground">
              Checking availability...
            </p>
          )}
          {usernameStatus === "available" && (
            <p className="mt-1 text-xs text-green-600">Username is available</p>
          )}
          {usernameStatus === "taken" && (
            <p className="mt-1 text-xs text-destructive">
              Username is already taken
            </p>
          )}
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Setting username..." : "Continue"}
        </Button>
      </form>
    </Card>
  );
}
