"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg text-center p-6 sm:p-8">
      <CardContent className="space-y-6 pt-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-sm">
          <XCircle className="size-10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            Payment Cancelled
          </span>
          <h1 className="text-2xl font-serif font-bold text-foreground mt-1">
            Payment Incomplete
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            You cancelled the Stripe checkout process. Your appointment slot remains confirmed and unpaid in your customer portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/dashboard/customer/appointments" className="w-full sm:w-auto">
            <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium">
              <Calendar className="mr-2 size-4" />
              Return to My Appointments
            </Button>
          </Link>
          <Link href="/services" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-1.5 size-4" />
              Browse Services
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 bg-muted/20">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>}>
        <PaymentCancelContent />
      </Suspense>
    </main>
  );
}
