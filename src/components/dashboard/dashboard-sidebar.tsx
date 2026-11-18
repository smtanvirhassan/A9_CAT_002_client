"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  User,
  Scissors,
  Users,
  CreditCard,
  PlusCircle,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  role: "admin" | "customer";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const handleSignout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const customerLinks = [
    {
      href: "/dashboard/customer",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/customer/appointments",
      label: "My Appointments",
      icon: Calendar,
      exact: false,
    },
    {
      href: "/dashboard/customer/profile",
      label: "My Profile",
      icon: User,
      exact: false,
    },
  ];

  const adminLinks = [
    {
      href: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/admin/services",
      label: "Manage Services",
      icon: Scissors,
      exact: false,
    },
    {
      href: "/dashboard/admin/appointments",
      label: "Manage Appointments",
      icon: Calendar,
      exact: false,
    },
    {
      href: "/dashboard/admin/users",
      label: "Manage Users",
      icon: Users,
      exact: false,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      href: "/dashboard/admin/profile",
      label: "My Profile",
      icon: User,
      exact: false,
    },
  ];

  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-border/80 bg-card p-4 shadow-sm flex flex-col justify-between h-fit">
      <div>
        <div className="px-3 py-2 border-b border-border/60 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            {role === "admin" ? "Admin Portal" : "Customer Portal"}
          </span>
          <p className="text-sm font-serif font-semibold text-foreground">
            {role === "admin" ? "Management Suite" : "Appointment Hub"}
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-700 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-border/60 flex flex-col gap-1">
        <Link
          href="/services"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Scissors className="size-4" />
          <span>Browse Public Services</span>
        </Link>
        <button
          onClick={handleSignout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left w-full"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
