import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalonBook - Salon Appointment Booking Platform",
  description: "Explore salon services, view detailed treatment info, and book luxury salon appointments online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
