import { checkUsernameAvailability } from '@/app/auth/actions';
import { useState, useEffect, useRef } from 'react';

interface CheckResult {
  username: string;
  available: boolean;
  error: string | null;
}

export function useUsernameAvailability(username: string) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (username.length < 3) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(username);
        if (res.error) {
          setResult({ username, available: false, error: res.error });
        } else {
          setResult({
            username,
            available: res.available ?? false,
            error: null,
          });
        }
      } catch {
        // Network error — leave as checking until next attempt
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  // Derive status from username length and latest result
  if (username.length < 3) {
    return { status: 'idle' as const, error: null };
  }
  if (!result || result.username !== username) {
    return { status: 'checking' as const, error: null };
  }
  if (result.error) {
    return { status: 'idle' as const, error: result.error };
  }
  return {
    status: (result.available ? 'available' : 'taken') as 'available' | 'taken',
    error: null,
  };
}
