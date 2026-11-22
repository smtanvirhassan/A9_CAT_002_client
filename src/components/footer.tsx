import Link from "next/link";
import { Scissors, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-amber-950 text-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="flex size-9 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
                <Scissors className="size-5" />
              </span>
              <span className="text-2xl font-serif text-white">
                Salon<span className="text-amber-400 font-sans font-extrabold">Book</span>
              </span>
            </Link>
            <p className="text-sm text-amber-200/80 leading-relaxed">
              Your premier destination for luxury hair styling, restorative skincare, and relaxing spa therapies. Book appointments with master stylists online anytime.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-amber-900/80 text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-amber-900/80 text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-amber-900/80 text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-amber-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-white transition-colors">
                  Haircut & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-white transition-colors">
                  Facials & Skincare
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              Salon Hours & Location
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-amber-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <span>452 Fifth Avenue, Suite 1200<br />New York, NY 10018</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-amber-200/80">
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-amber-400" />
                <a href="tel:+15552345678" className="hover:text-white transition-colors">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-amber-400" />
                <a href="mailto:appointments@salonbook.com" className="hover:text-white transition-colors">
                  appointments@salonbook.com
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-block rounded-md bg-amber-900/60 border border-amber-800 px-3 py-1.5 text-xs text-amber-300">
                  ✨ Instant online booking confirmation
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-amber-900/60 pt-6 text-center text-xs text-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SalonBook Platform. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="hover:text-amber-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-200 cursor-pointer">Cancellation Policy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
