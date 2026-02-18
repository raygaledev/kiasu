'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { EditProfileModal } from './edit-profile-modal';

interface EditProfileButtonProps {
  currentUsername: string;
  currentEmail: string;
  hasPassword: boolean;
  isPremium: boolean;
}

export function EditProfileButton({
  currentUsername,
  currentEmail,
  hasPassword,
  isPremium,
}: EditProfileButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit profile
      </button>

      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        currentUsername={currentUsername}
        currentEmail={currentEmail}
        hasPassword={hasPassword}
        isPremium={isPremium}
      />
    </>
  );
}
