"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  CreditCard,
  MessageSquare,
  Loader2,
  Check,
  X,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import type { IAppointment } from "@/lib/types/appointment";

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/appointments/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "confirmed" | "cancelled") => {
    setActionLoadingId(id);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to update appointment status");
        return;
      }

      toast.success(
        newStatus === "confirmed"
          ? "Appointment confirmed! Customer can now pay via Stripe."
          : "Appointment cancelled."
      );
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message || "Failed to update appointment status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) =>
    statusFilter === "all" ? true : app.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Manage All Appointments
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review customer bookings, approve pending slots, and monitor Stripe payment completion.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-card border border-border p-1 rounded-lg">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? "bg-amber-700 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-amber-600" />
          Loading appointment requests...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Calendar className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <p className="text-sm font-semibold text-foreground">No appointments in this view</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 uppercase tracking-wider text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Service Info</th>
                <th className="px-4 py-3.5">Date & Slot</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAppointments.map((app) => {
                const isPending = app.status === "pending";
                const isConfirmed = app.status === "confirmed";
                const isCancelled = app.status === "cancelled";
                const isPaid = app.paymentStatus === "paid";
                const isProcessing = actionLoadingId === app._id;

                return (
                  <tr key={app._id} className="hover:bg-muted/20 transition-colors">
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <User className="size-3.5 text-amber-700" />
                          {app.customerName}
                        </p>
                        <p className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Mail className="size-3 text-muted-foreground" />
                          {app.customerEmail}
                        </p>
                        {app.message && (
                          <p className="text-[11px] text-stone-600 bg-muted/50 p-1.5 rounded mt-1 italic">
                            &quot;{app.message}&quot;
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground">{app.serviceName}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {app.serviceCategory}
                      </span>
                    </td>

                    {/* Date & Slot */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-medium text-foreground">{app.appointmentDate}</p>
                      <p className="text-muted-foreground text-[11px]">{app.timeSlot}</p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-bold text-foreground text-sm">
                      ${app.servicePrice}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          isConfirmed
                            ? "bg-emerald-100 text-emerald-800"
                            : isCancelled
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        <CreditCard className="size-3" />
                        {app.paymentStatus}
                      </span>
                    </td>

                    {/* Actions: Confirm (pending only), Cancel (pending or confirmed) */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <Button
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus(app._id, "confirmed")}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-7 px-2.5"
                          >
                            <Check className="mr-1 size-3.5" />
                            Confirm
                          </Button>
                        )}

                        {(isPending || isConfirmed) && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus(app._id, "cancelled")}
                            className="text-destructive hover:bg-destructive/10 text-xs h-7 px-2.5 border-destructive/30"
                          >
                            <X className="mr-1 size-3.5" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
