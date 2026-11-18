"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, User, LogOut, LayoutDashboard, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  const handleSignout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-shadow duration-300 hover:shadow-xs">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground transition-all duration-300 hover:opacity-95"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-6deg] group-hover:shadow-amber-900/20">
              <Scissors className="size-4.5 transition-transform duration-300 group-hover:rotate-12" />
            </span>
            <span className="flex items-center gap-1 text-2xl font-serif">
              Salon<span className="text-amber-700 font-sans font-extrabold transition-colors duration-300 group-hover:text-amber-800">Book</span>
            </span>
          </Link>

          {/* Navigation Links with animated hover pill + expand underline */}
          <ul className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out",
                      isActive
                        ? "text-amber-900 bg-amber-100/90 font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-amber-900 hover:bg-amber-50/80 hover:shadow-xs"
                    )}
                  >
                    <span className="relative z-10 transition-transform duration-200 group-hover:translate-y-[-1px]">
                      {link.label}
                    </span>

                    {/* Animated gradient underline effect on hover */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 transition-all duration-300 ease-out",
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Authentication / Profile Actions */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 hover:shadow-xs"
                >
                  <LayoutDashboard className="size-3.5 text-amber-700" />
                  Dashboard
                </Button>
              </Link>

              <Popover>
                <PopoverTrigger
                  render={
                    <button className="group flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-transform duration-200 hover:scale-105">
                      <Avatar className="size-9 border-2 border-amber-300 transition-colors group-hover:border-amber-600 shadow-xs">
                        <AvatarImage
                          referrerPolicy="no-referrer"
                          src={user.image || ""}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  }
                />
                <PopoverContent align="end" className="w-64 p-4 shadow-xl rounded-2xl border-border/80">
                  <PopoverHeader className="pb-3 border-b border-border/60">
                    <PopoverTitle className="font-semibold text-foreground truncate">
                      {user.name}
                    </PopoverTitle>
                    <PopoverDescription className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </PopoverDescription>
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 w-fit">
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </span>
                  </PopoverHeader>

                  <div className="mt-3 flex flex-col gap-1">
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-amber-700" />
                      Dashboard
                    </Link>
                    <Link
                      href={`${dashboardHref}/profile`}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors"
                    >
                      <User className="size-4 text-amber-700" />
                      My Profile
                    </Link>
                    {user.role !== "admin" && (
                      <Link
                        href="/dashboard/customer/appointments"
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors"
                      >
                        <Calendar className="size-4 text-amber-700" />
                        My Appointments
                      </Link>
                    )}
                    <button
                      onClick={handleSignout}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full text-left mt-1 border-t border-border/50 pt-2.5"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium rounded-full px-4 text-muted-foreground hover:text-amber-900 hover:bg-amber-50/80 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-xs font-semibold rounded-full px-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
