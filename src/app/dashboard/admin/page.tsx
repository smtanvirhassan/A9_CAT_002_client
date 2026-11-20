"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalActiveServices: 0,
    totalAppointmentRequests: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalSuccessfulPayments: { count: 0, amount: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const token = await getTokenFromClient();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const res = await fetch(`${apiUrl}/overview/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load admin metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const metricCards = [
    {
      title: "Registered Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      link: "/dashboard/admin/users",
    },
    {
      title: "Active Salon Services",
      value: stats.totalActiveServices,
      icon: Scissors,
      color: "bg-amber-100 text-amber-700",
      link: "/dashboard/admin/services",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointmentRequests,
      icon: Calendar,
      color: "bg-purple-100 text-purple-700",
      link: "/dashboard/admin/appointments",
    },
    {
      title: "Pending Approval",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
      link: "/dashboard/admin/appointments",
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700",
      link: "/dashboard/admin/appointments",
    },
    {
      title: "Successful Payments",
      value: `$${stats.totalSuccessfulPayments.amount.toFixed(2)}`,
      subtitle: `${stats.totalSuccessfulPayments.count} paid transaction(s)`,
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
      link: "/dashboard/admin/transactions",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            Administrative Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-light mt-1">
            SalonBook Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg">
            Monitor real-time customer bookings, manage salon service catalog, review customer accounts, and audit Stripe revenue.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/dashboard/admin/services">
            <Button variant="amber" className="text-sm font-semibold px-4 shadow-sm">
              Manage Services
            </Button>
          </Link>
          <Link href="/dashboard/admin/appointments">
            <Button variant="amber" className="text-sm font-semibold px-4 shadow-sm">
              Review Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.title}
              href={metric.link}
              className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-amber-400/60 hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.title}
                </span>
                <div className={`flex size-9 items-center justify-center rounded-xl ${metric.color}`}>
                  <Icon className="size-4.5" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-serif font-bold text-foreground">
                  {loading ? (
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  ) : (
                    metric.value
                  )}
                </p>
                {metric.subtitle && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{metric.subtitle}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-amber-700">
                <span>View Details</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
