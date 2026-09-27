import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
      <p className="text-xs text-muted-foreground animate-pulse font-mono">
        Adulting.exe wird geladen...
      </p>
    </div>
  );
}

