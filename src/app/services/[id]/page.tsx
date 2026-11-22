import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Clock, Sparkles, Shield, Check, Scissors, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { BookingForm } from "@/components/services/booking-form";
import type { IService } from "@/lib/types/service";

async function getService(id: string): Promise<IService | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const res = await fetch(`${apiUrl}/services`, { cache: "no-store" });
    if (!res.ok) return null;
    const services: IService[] = await res.json();
    const service = services.find((s) => s._id === id);
    return service || null;
  } catch (err: any) {
    console.error("Error fetching service:", err);
    return null;
  }
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("ServiceDetailsPage auth session error:", err);
  }

  if (!session?.user) {
    redirect(`/login?callbackUrl=/services/${id}`);
  }

  const service = await getService(id);

  if (!service) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-4">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Service Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The service ID &quot;{id}&quot; does not correspond to any active treatment in our directory.
        </p>
        <div className="mt-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to All Services
          </Link>
        </div>
      </main>
    );
  }

  const servicePerks = [
    "Personalized consultation with master stylist",
    "Complimentary luxury shampoo & scalp massage",
    "Premium organic & cruelty-free botanical formulas",
    "Flexible reschedule policy up to 24 hours prior",
  ];

  return (
    <main className="min-h-screen py-10 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-border shadow-md">
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 rounded-full bg-amber-900/85 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-amber-100 shadow-md">
                {service.category}
              </div>
              {service.status !== "active" && (
                <div className="absolute top-4 right-4 rounded-full bg-destructive/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white shadow-md">
                  Currently Inactive
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                <Scissors className="size-3.5" />
                <span>Professional Treatment</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground">
                {service.serviceName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border/70 py-3">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="size-4 text-amber-600" />
                  Estimated Duration: {service.duration} Minutes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Sparkles className="size-4 text-amber-600" />
                  Category: {service.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Shield className="size-4" />
                  Sanitized Equipment Guaranteed
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Treatment Overview
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-6">
              <h3 className="text-sm font-semibold text-foreground">
                What&apos;s Included With This Appointment:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                {servicePerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <BookingForm service={service} />
          </div>
        </div>
      </div>
    </main>
  );
}
