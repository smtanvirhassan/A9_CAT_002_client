"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Scissors,
  Crown,
  Sparkles,
  Coffee,
  VolumeX,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IService } from "@/lib/types/service";

const timeSlots = [
  "09:00 AM - 10:00 AM (Morning)",
  "09:30 AM - 10:30 AM (Morning)",
  "10:30 AM - 11:30 AM (Morning)",
  "11:30 AM - 12:30 PM (Midday)",
  "01:00 PM - 02:00 PM (Afternoon)",
  "02:00 PM - 03:00 PM (Afternoon)",
  "03:00 PM - 04:00 PM (Afternoon)",
  "04:00 PM - 05:00 PM (Afternoon)",
  "05:00 PM - 06:00 PM (Evening)",
  "06:00 PM - 07:00 PM (Evening)",
  "07:00 PM - 08:00 PM (Late VIP)",
];

const specialistTiers = [
  {
    id: "senior",
    name: "Senior Stylist / Therapist",
    fee: 0,
    note: "Included in standard service fee",
  },
  {
    id: "master",
    name: "Master Educator & Colorist",
    fee: 15,
    note: "+$15 • 10+ years experience & academy honors",
  },
  {
    id: "director",
    name: "Salon Creative Director (VIP Suite)",
    fee: 35,
    note: "+$35 • Private suite & personalized couture ritual",
  },
];

const availableAddOns = [
  {
    id: "scalp-rinse",
    name: "Aromatherapy Scalp Rinse",
    price: 15,
    desc: "Herbal essential oils & relaxing acupressure",
  },
  {
    id: "eye-mask",
    name: "Collagen & Peptide Eye Mask",
    price: 20,
    desc: "De-puffing anti-fatigue hydration treatment",
  },
  {
    id: "botanical-towel",
    name: "Warm Botanical Towel & Hand Massage",
    price: 12,
    desc: "Warm lavender towel wrap and softening balm",
  },
  {
    id: "shine-glaze",
    name: "Keratin Quick Gloss Glaze",
    price: 25,
    desc: "Instant mirror shine & environmental shield",
  },
];

const refreshmentOptions = [
  "Complimentary Herbal Green Tea",
  "Artisan Handcrafted Espresso",
  "Sparkling Water with Fresh Citrus",
  "Chilled Prosecco / Bellini",
  "No Refreshment Needed",
];

interface BookingFormProps {
  service: IService;
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  // Form states
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(specialistTiers[0].id);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [refreshment, setRefreshment] = useState(refreshmentOptions[0]);
  const [silentAppointment, setSilentAppointment] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // Pricing calculations
  const specialistFee = useMemo(() => {
    const tier = specialistTiers.find((t) => t.id === selectedSpecialist);
    return tier ? tier.fee : 0;
  }, [selectedSpecialist]);

  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((sum, addOnId) => {
      const item = availableAddOns.find((a) => a.id === addOnId);
      return sum + (item ? item.price : 0);
    }, 0);
  }, [selectedAddOns]);

  const estimatedTotal = (service.price || 0) + specialistFee + addOnsTotal;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      toast.error("Please sign in to book an appointment.");
      router.push(`/login?callbackUrl=/services/${service._id}`);
      return;
    }

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

      // Build structured preferences note
      const specialistName = specialistTiers.find((t) => t.id === selectedSpecialist)?.name;
      const addOnNames = selectedAddOns
        .map((id) => availableAddOns.find((a) => a.id === id)?.name)
        .filter(Boolean);

      const preferenceNotes = [
        specialistName ? `Specialist: ${specialistName}` : null,
        addOnNames.length > 0 ? `Add-ons: ${addOnNames.join(", ")}` : null,
        `Refreshment: ${refreshment}`,
        silentAppointment ? `Quiet Treatment: Yes (Silent Appointment)` : null,
        message ? `Client Notes: ${message.trim()}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

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
          message: preferenceNotes,
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
      {/* Header Pricing & Duration */}
      <div className="flex items-center justify-between pb-4 border-b border-border/80">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Standard Base Fee</span>
          <p className="text-3xl font-serif font-bold text-amber-900">${service.price}</p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Treatment Duration</span>
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Preferred Date */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-amber-600" />
              <span>1. Select Appointment Date *</span>
            </label>
            <div className="relative">
              <Input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-background text-xs"
              />
            </div>
          </div>

          {/* 2. Time Slot Option */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber-600" />
              <span>2. Available Time Slot *</span>
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Specialist Tier Option */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Crown className="size-3.5 text-amber-600" />
              <span>3. Preferred Specialist Tier</span>
            </label>
            <div className="space-y-2">
              {specialistTiers.map((tier) => (
                <label
                  key={tier.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedSpecialist === tier.id
                      ? "bg-amber-50/80 border-amber-400 text-amber-950 font-medium"
                      : "bg-background border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="specialist"
                    value={tier.id}
                    checked={selectedSpecialist === tier.id}
                    onChange={() => setSelectedSpecialist(tier.id)}
                    className="mt-0.5 text-amber-700 focus:ring-amber-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{tier.name}</p>
                    <p className="text-[11px] text-muted-foreground">{tier.note}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Luxury Add-On Treatments Option */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>4. Luxury Add-On Treatments (Optional)</span>
            </label>
            <div className="space-y-1.5">
              {availableAddOns.map((addOn) => {
                const isChecked = selectedAddOns.includes(addOn.id);
                return (
                  <label
                    key={addOn.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-amber-50/70 border-amber-300 text-amber-950"
                        : "bg-background border-border/70 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="rounded text-amber-700 focus:ring-amber-600"
                      />
                      <div>
                        <p className="font-medium text-foreground">{addOn.name}</p>
                        <p className="text-[10px] text-muted-foreground">{addOn.desc}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-800 text-[11px]">
                      +${addOn.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Hospitality & Comfort Preferences */}
          <div className="pt-2 border-t border-border/60 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Coffee className="size-3.5 text-amber-600" />
                <span>5. Complimentary Guest Refreshment</span>
              </label>
              <select
                value={refreshment}
                onChange={(e) => setRefreshment(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-amber-600"
              >
                {refreshmentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={silentAppointment}
                onChange={(e) => setSilentAppointment(e.target.checked)}
                className="rounded text-amber-700 focus:ring-amber-600"
              />
              <span className="flex items-center gap-1">
                <VolumeX className="size-3.5 text-muted-foreground" />
                Quiet Treatment (Minimal conversation, full peaceful relaxation)
              </span>
            </label>
          </div>

          {/* 6. Special Requests */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-amber-600" />
              <span>Special Notes / Hair & Skin Details (Optional)</span>
            </label>
            <Textarea
              rows={2}
              placeholder="e.g. scalp sensitivity, hair inspiration, allergies..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none text-xs bg-background"
            />
          </div>

          {/* Summary Box */}
          <div className="rounded-lg bg-amber-50/60 border border-amber-200/80 p-3.5 space-y-1 text-xs text-amber-950">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Treatment:</span>
              <span>${service.price}</span>
            </div>
            {specialistFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialist Tier:</span>
                <span>+${specialistFee}</span>
              </div>
            )}
            {addOnsTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Add-On Services ({selectedAddOns.length}):</span>
                <span>+${addOnsTotal}</span>
              </div>
            )}
            <div className="pt-2 border-t border-amber-200 flex justify-between font-bold text-sm text-amber-900">
              <span>Estimated Total:</span>
              <span>${estimatedTotal}</span>
            </div>
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
              `Request Appointment • $${estimatedTotal}`
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
