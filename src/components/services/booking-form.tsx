"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MessageSquare, AlertCircle, CheckCircle2, Loader2, Scissors } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IService } from "@/lib/types/service";

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

interface BookingFormProps {
  service: IService;
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      toast.error("Please sign in to book an appointment.");
      router.push(`/login?callbackUrl=/services/${service._id}`);
      return;
    }

    // Admins cannot submit customer appointments
    if (user.role === "admin") {
      setErrorMessage("Administrator accounts cannot submit appointment requests. Please use a customer account.");
      toast.error("Admins cannot submit customer appointment requests.");
      return;
    }

    if (service.status !== "active") {
      setErrorMessage("This service is currently inactive and cannot be booked.");
      toast.error("Inactive service cannot be booked.");
      return;
    }

    if (!date) {
      setErrorMessage("Please select a valid appointment date.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate: date,
          timeSlot: timeSlot,
          message: message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.msg || "Failed to submit booking request.");
        toast.error(data.msg || "Failed to submit appointment request.");
        return;
      }

      toast.success("Appointment request submitted successfully!");
      router.push("/dashboard/customer/appointments");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while booking.");
      toast.error(err.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200/80 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border/80">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Treatment Fee</span>
          <p className="text-3xl font-serif font-bold text-amber-900">${service.price}</p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Duration</span>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1 justify-end">
            <Clock className="size-3.5 text-amber-600" />
            {service.duration} mins
          </p>
        </div>
      </div>

      {service.status !== "active" ? (
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 text-amber-700 mt-0.5" />
          <span>This service is currently unavailable for online booking. Please check back later.</span>
        </div>
      ) : user?.role === "admin" ? (
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 text-amber-700 mt-0.5" />
          <span>You are logged in as an <strong>Administrator</strong>. Admins cannot submit customer booking requests.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Appointment Date */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Preferred Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Available Time Slot *
            </label>
            <div className="relative">
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-600"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Special Requests / Stylist Notes (Optional)
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. skin allergies, preferred hair length, or specific hair inspiration..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none text-xs bg-background"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2.5 shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Request Appointment"
            )}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground pt-1">
            Appointments start as <strong>Pending</strong>. You will be able to pay securely via Stripe once the salon confirms your slot.
          </p>
        </form>
      )}
    </div>
  );
}
