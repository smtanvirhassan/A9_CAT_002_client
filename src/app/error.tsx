"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured by root error boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-lg">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 mb-4">
          <AlertCircle className="size-7" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Something Went Wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          We encountered an unexpected error while loading this page. Please try reloading or head back to the homepage.
        </p>

        {error?.digest && (
          <p className="mt-2 text-xs font-mono text-muted-foreground/80 bg-muted/60 py-1 px-2 rounded inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white font-medium"
          >
            <RotateCcw className="mr-2 size-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
