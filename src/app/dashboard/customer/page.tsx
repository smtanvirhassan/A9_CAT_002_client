"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import type { IAppointment } from "@/lib/types/appointment";

export default function CustomerOverviewPage() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    paid: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const token = await getTokenFromClient();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const [statsRes, appointmentsRes] = await Promise.all([
          fetch(`${apiUrl}/overview/customer`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/appointments/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          setRecentAppointments(appointmentsData.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load customer overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Requests",
      count: stats.totalRequests,
      icon: Calendar,
      color: "bg-blue-100 text-blue-700",
      description: "All submitted bookings",
    },
    {
      title: "Pending",
      count: stats.pending,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
      description: "Awaiting salon confirmation",
    },
    {
      title: "Confirmed",
      count: stats.confirmed,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700",
      description: "Approved & ready for payment",
    },
    {
      title: "Cancelled",
      count: stats.cancelled,
      icon: XCircle,
      color: "bg-rose-100 text-rose-700",
      description: "Cancelled requests",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-900 to-stone-900 p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-light mt-1">
            Welcome to Your Salon Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg">
            Track your appointment requests, review confirmation statuses, and proceed to Stripe checkout for confirmed bookings.
          </p>
        </div>
        <Link href="/services">
          <Button variant="amber" className="text-sm font-semibold px-4 shadow-sm">
            Book New Treatment
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </Link>
      </div>

      {/* Metrics Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                <div className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {loading ? "..." : card.count}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments Preview */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-semibold text-foreground">
            Recent Appointments
          </h2>
          <Link
            href="/dashboard/customer/appointments"
            className="text-xs font-medium text-amber-700 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-amber-600" />
            Loading appointments...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border rounded-xl">
            <Calendar className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">No appointment requests yet</p>
            <p className="text-xs text-muted-foreground mt-1">Explore our services and reserve your first session!</p>
            <Link href="/services">
              <Button size="sm" variant="outline" className="mt-4 text-xs">
                Browse Salon Services
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentAppointments.map((app) => (
              <div key={app._id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{app.serviceName}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>Date: {app.appointmentDate}</span>
                    <span>•</span>
                    <span>Slot: {app.timeSlot}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">${app.servicePrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      app.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status}
                  </span>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      app.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
