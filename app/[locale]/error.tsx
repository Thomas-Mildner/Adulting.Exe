"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorBoundary");

  useEffect(() => {
    console.error("App Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center shadow-lg backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-5">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t("description")}
        </p>

        {error.message && process.env.NODE_ENV !== "production" && (
          <div className="mb-6 rounded-lg bg-background/80 p-3 text-left font-mono text-xs text-destructive/90 overflow-x-auto border border-border">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            variant="default"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("retry")}
          </Button>
          <Button
            variant="outline"
            asChild
            className="gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              {t("home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

