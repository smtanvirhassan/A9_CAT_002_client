"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical global error captured:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground antialiased font-sans">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 mb-4">
            <AlertCircle className="size-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">A Server Error Occurred</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The application experienced an unexpected server issue. Please click below to reload the page.
          </p>

          {error?.digest && (
            <p className="mt-2 text-xs font-mono text-muted-foreground/80 bg-muted/60 py-1 px-2 rounded inline-block">
              Code: {error.digest}
            </p>
          )}

          <div className="mt-6">
            <Button
              onClick={() => reset()}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium"
            >
              <RotateCcw className="mr-2 size-4" />
              Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
