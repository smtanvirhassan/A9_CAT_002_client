import Link from "next/link";
import { Scissors, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-lg">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
          <Scissors className="size-7" />
        </div>
        <span className="text-4xl font-serif font-black text-amber-700">404</span>
        <h1 className="mt-2 text-2xl font-serif font-bold text-foreground">Page Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The page or treatment service you are looking for doesn&apos;t exist or has been relocated.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/services" className="w-full sm:w-auto">
            <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium">
              <Scissors className="mr-2 size-4" />
              Browse Services
            </Button>
          </Link>
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
