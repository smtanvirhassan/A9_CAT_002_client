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
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-colors hover:text-amber-700"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-amber-700 text-white shadow-sm">
              <Scissors className="size-5" />
            </span>
            <span className="flex items-center gap-1 text-2xl font-serif">
              Salon<span className="text-amber-700 font-sans font-extrabold">Book</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-6">
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
                      "text-sm font-medium transition-colors hover:text-amber-700",
                      isActive
                        ? "text-amber-700 border-b-2 border-amber-700 pb-1"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Authentication / Profile Actions */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardHref}>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 text-xs">
                  <LayoutDashboard className="size-3.5" />
                  Dashboard
                </Button>
              </Link>

              <Popover>
                <PopoverTrigger
                  render={
                    <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2">
                      <Avatar className="size-9 border border-amber-200">
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
                <PopoverContent align="end" className="w-64 p-4 shadow-lg">
                  <PopoverHeader className="pb-3 border-b border-border">
                    <PopoverTitle className="font-medium text-foreground truncate">
                      {user.name}
                    </PopoverTitle>
                    <PopoverDescription className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </PopoverDescription>
                    <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </span>
                  </PopoverHeader>

                  <div className="mt-3 flex flex-col gap-1">
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      href={`${dashboardHref}/profile`}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <User className="size-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    {user.role !== "admin" && (
                      <Link
                        href="/dashboard/customer/appointments"
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <Calendar className="size-4 text-muted-foreground" />
                        My Appointments
                      </Link>
                    )}
                    <button
                      onClick={handleSignout}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left mt-1 border-t border-border/50 pt-2"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white text-sm shadow-sm">
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
