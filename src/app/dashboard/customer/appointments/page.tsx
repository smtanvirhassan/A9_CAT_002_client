"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  CreditCard,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import type { IAppointment } from "@/lib/types/appointment";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending appointment?")) {
      return;
    }

    setActionLoadingId(id);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to cancel appointment.");
        return;
      }

      toast.success("Appointment request cancelled successfully.");
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel appointment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePayNow = async (appointment: IAppointment) => {
    setActionLoadingId(appointment._id);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: appointment._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to initialize Stripe checkout.");
        return;
      }

      if (data.url) {

        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Payment initiation failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">
          My Appointments
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review your treatment requests, track real-time status updates, and complete payment for confirmed slots.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-amber-600" />
          Loading your appointment history...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarCheck className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <h2 className="text-base font-semibold text-foreground">No appointments booked</h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            You currently have no salon appointment requests on file. Browse our service directory to schedule your visit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => {
            const isPending = app.status === "pending";
            const isConfirmed = app.status === "confirmed";
            const isCancelled = app.status === "cancelled";
            const isPaid = app.paymentStatus === "paid";
            const isProcessing = actionLoadingId === app._id;

            return (
              <div
                key={app._id}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-amber-300/60"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {app.serviceImage ? (
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                        <Image
                          src={app.serviceImage}
                          alt={app.serviceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
                        SB
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-base">
                          {app.serviceName}
                        </h3>
                        {app.serviceCategory && (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                            {app.serviceCategory}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="size-3.5 text-amber-600" />
                          {app.appointmentDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-amber-600" />
                          {app.timeSlot}
                        </span>
                        <span className="font-bold text-amber-900 text-sm">
                          ${app.servicePrice}
                        </span>
                      </div>

                      {app.message && (
                        <p className="mt-2 text-xs text-muted-foreground italic line-clamp-1 bg-muted/40 px-2 py-1 rounded">
                          &quot;{app.message}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-col items-end gap-3 self-end md:self-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isConfirmed
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : isCancelled
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 className="size-3" />}
                        {isCancelled && <XCircle className="size-3" />}
                        {isPending && <Clock className="size-3" />}
                        {app.status}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-stone-100 text-stone-700 border border-stone-200"
                        }`}
                      >
                        <CreditCard className="size-3" />
                        {app.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleCancelAppointment(app._id)}
                          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                        >
                          {isProcessing ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <XCircle className="mr-1 size-3.5" />
                          )}
                          Cancel Request
                        </Button>
                      )}

                      {isConfirmed && !isPaid && (
                        <Button
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handlePayNow(app)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm"
                        >
                          {isProcessing ? (
                            <Loader2 className="size-3 animate-spin mr-1" />
                          ) : (
                            <CreditCard className="mr-1.5 size-3.5" />
                          )}
                          Pay Now with Stripe
                        </Button>
                      )}

                      {isPaid && (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          Payment Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    Requested on:{" "}
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                  <span>ID: {app._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
