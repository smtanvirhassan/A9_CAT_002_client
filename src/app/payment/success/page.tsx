"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifying, setVerifying] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    async function syncPayment() {
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      try {
        const token = await getTokenFromClient();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const res = await fetch(`${apiUrl}/payment/verify-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          const data = await res.json();
          setSessionDetails(data.session);
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    }

    syncPayment();
  }, [sessionId]);

  return (
    <Card className="w-full max-w-lg border-border/80 shadow-lg text-center p-6 sm:p-8">
      <CardContent className="space-y-6 pt-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
          <CheckCircle2 className="size-10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Payment Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Appointment Confirmed!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Thank you for your payment. Your salon booking has been fully confirmed and registered in our calendar system.
          </p>
        </div>

        {verifying ? (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
            <Loader2 className="size-4 animate-spin text-amber-600" />
            Verifying Stripe transaction details...
          </div>
        ) : (
          <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className="font-semibold text-emerald-700 uppercase">Paid Successfully</span>
            </div>
            {sessionId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Reference:</span>
                <span className="font-mono text-[11px] text-foreground truncate max-w-[200px]">
                  {sessionId}
                </span>
              </div>
            )}
            {sessionDetails?.metadata?.serviceName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Treatment:</span>
                <span className="font-medium text-foreground">{sessionDetails.metadata.serviceName}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/dashboard/customer/appointments" className="w-full sm:w-auto">
            <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium">
              <Calendar className="mr-2 size-4" />
              View My Appointments
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 bg-muted/20">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Verifying payment...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
