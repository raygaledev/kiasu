import { Globe, Lock } from 'lucide-react';

interface VisibilityToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
}

export function VisibilityToggle({
  isPublic,
  onChange,
}: VisibilityToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-0.5">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${isPublic ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Globe className="h-3.5 w-3.5" />
        Public
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${!isPublic ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Lock className="h-3.5 w-3.5" />
        Private
      </button>
    </div>
  );
}
