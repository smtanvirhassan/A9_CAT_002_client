import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Scissors, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white py-20 lg:py-32">
      {/* Salon-Themed Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Salon Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Sparkles className="size-3.5" />
            <span>Luxury Hair, Beauty & Wellness Treatments</span>
          </div>

          <h1 className="text-4xl font-serif font-light tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
            Elevate Your Style. <br />
            <span className="font-normal text-amber-300 font-sans italic">
              Experience Perfection.
            </span>
          </h1>

          <p className="text-base text-stone-300 sm:text-lg leading-relaxed">
            Welcome to SalonBook. Discover award-winning stylists, rejuvenate with botanical facials, and reserve your personalized salon appointment in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 shadow-lg shadow-amber-900/40">
                Explore Salon Services
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/services?category=Haircut+%26+Styling">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-stone-600 text-stone-200 hover:bg-stone-800/80 hover:text-white">
                <Scissors className="mr-2 size-4 text-amber-400" />
                Popular Cuts & Color
              </Button>
            </Link>
          </div>

          {/* Highlights / Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-800/80 text-xs text-stone-300">
            <div>
              <p className="font-bold text-lg text-amber-300">100%</p>
              <p className="text-stone-400">Certified Stylists</p>
            </div>
            <div>
              <p className="font-bold text-lg text-amber-300">Instant</p>
              <p className="text-stone-400">Online Booking</p>
            </div>
            <div>
              <p className="font-bold text-lg text-amber-300">4.9 ★</p>
              <p className="text-stone-400">Client Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
