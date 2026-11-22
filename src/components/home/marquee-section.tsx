import {
  Sparkles,
  Scissors,
  Crown,
  Award,
  ShieldCheck,
  Coffee,
  Leaf,
  Star,
  Gem,
  CheckCircle,
} from "lucide-react";

interface BrandItem {
  name: string;
  tagline: string;
  badge: string;
  initials: string;
}

interface PerkItem {
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
}

const BRANDS: BrandItem[] = [
  {
    name: "Kérastase Paris",
    tagline: "Haute Luxury Hair Care",
    badge: "Official Salon",
    initials: "KP",
  },
  {
    name: "Olaplex Pro",
    tagline: "Patented Bond Repair",
    badge: "Certified",
    initials: "OP",
  },
  {
    name: "Dyson Professional",
    tagline: "Intelligent Thermal Styling",
    badge: "Equipment Partner",
    initials: "DY",
  },
  {
    name: "Davines Sustainable",
    tagline: "B-Corp Organic Formulas",
    badge: "Eco-Luxe",
    initials: "DV",
  },
  {
    name: "Valmont Switzerland",
    tagline: "Cellular Spa & Anti-Age",
    badge: "VIP Facial Line",
    initials: "VS",
  },
  {
    name: "Moroccanoil",
    tagline: "Antioxidant Argan Elixirs",
    badge: "Nourishing Care",
    initials: "MO",
  },
  {
    name: "Oribe Luxury",
    tagline: "Obsessively Formulated",
    badge: "Runway Standard",
    initials: "OR",
  },
  {
    name: "L'Oréal Haute",
    tagline: "French Art of Color",
    badge: "Master Colorist",
    initials: "LP",
  },
];

const PERKS: PerkItem[] = [
  {
    icon: Crown,
    title: "Private VIP Styling Suites",
    subtitle: "Complete privacy & personalized pampering",
  },
  {
    icon: Leaf,
    title: "100% Organic & Cruelty-Free",
    subtitle: "Eco-certified, skin-friendly botanical formulas",
  },
  {
    icon: Scissors,
    title: "Master Colorists & Stylists",
    subtitle: "Trained by Paris & London academy directors",
  },
  {
    icon: Coffee,
    title: "Complimentary Artisan Bar",
    subtitle: "Handcrafted espresso, herbal infusions & bellinis",
  },
  {
    icon: ShieldCheck,
    title: "Hospital-Grade Sanitization",
    subtitle: "Medical autoclave & sealed single-use tools",
  },
  {
    icon: CheckCircle,
    title: "Instant Stripe Slot Confirmation",
    subtitle: "Conflict-free booking with encrypted checkout",
  },
  {
    icon: Star,
    title: "4.9/5 Average Guest Rating",
    subtitle: "Trusted by over 12,000 satisfied appointments",
  },
  {
    icon: Gem,
    title: "Bespoke Scalp & Skin Analysis",
    subtitle: "Diagnostic consultation before every treatment",
  },
];

export function MarqueeSection() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-100 py-10 sm:py-14 border-y border-amber-500/20 select-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-96 rounded-full bg-amber-800/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
          <Sparkles className="size-3 text-amber-400" />
          <span>The SalonBook Distinction</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-stone-400">Couture Formulations & Standards</span>
        </div>
      </div>

      <div className="relative z-10 pause-hover space-y-4 sm:space-y-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">

        <div className="overflow-hidden">
          <div className="animate-marquee flex items-center gap-4">
            {BRANDS.map((brand, idx) => (
              <div
                key={`b1-${idx}`}
                className="group/item flex items-center gap-3.5 rounded-xl border border-stone-800/80 bg-stone-900/70 hover:bg-stone-850 px-5 py-3 transition-all duration-300 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-950/40 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer backdrop-blur-xs"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 text-white font-serif font-bold text-xs tracking-wider shadow-sm group-hover/item:scale-105 transition-transform">
                  {brand.initials}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-tight text-white group-hover/item:text-amber-300 transition-colors">
                      {brand.name}
                    </p>
                    <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.2 text-[10px] font-medium text-amber-300">
                      {brand.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-light">
                    {brand.tagline}
                  </p>
                </div>
              </div>
            ))}

            {BRANDS.map((brand, idx) => (
              <div
                key={`b2-${idx}`}
                className="group/item flex items-center gap-3.5 rounded-xl border border-stone-800/80 bg-stone-900/70 hover:bg-stone-850 px-5 py-3 transition-all duration-300 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-950/40 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer backdrop-blur-xs"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 text-white font-serif font-bold text-xs tracking-wider shadow-sm group-hover/item:scale-105 transition-transform">
                  {brand.initials}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-tight text-white group-hover/item:text-amber-300 transition-colors">
                      {brand.name}
                    </p>
                    <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.2 text-[10px] font-medium text-amber-300">
                      {brand.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-light">
                    {brand.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="animate-marquee-reverse flex items-center gap-4">
            {PERKS.map((perk, idx) => {
              const IconComponent = perk.icon;
              return (
                <div
                  key={`p1-${idx}`}
                  className="group/item flex items-center gap-3 rounded-xl border border-stone-800/70 bg-gradient-to-r from-stone-900/80 to-stone-900/50 hover:to-stone-850 px-4.5 py-2.5 transition-all duration-300 hover:border-amber-400/50 hover:shadow-md hover:shadow-amber-950/30 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer backdrop-blur-xs"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover/item:bg-amber-500 group-hover/item:text-stone-950 transition-colors">
                    <IconComponent className="size-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold tracking-tight text-stone-200 group-hover/item:text-amber-200 transition-colors">
                      {perk.title}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {perk.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}

            {PERKS.map((perk, idx) => {
              const IconComponent = perk.icon;
              return (
                <div
                  key={`p2-${idx}`}
                  className="group/item flex items-center gap-3 rounded-xl border border-stone-800/70 bg-gradient-to-r from-stone-900/80 to-stone-900/50 hover:to-stone-850 px-4.5 py-2.5 transition-all duration-300 hover:border-amber-400/50 hover:shadow-md hover:shadow-amber-950/30 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer backdrop-blur-xs"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover/item:bg-amber-500 group-hover/item:text-stone-950 transition-colors">
                    <IconComponent className="size-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold tracking-tight text-stone-200 group-hover/item:text-amber-200 transition-colors">
                      {perk.title}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {perk.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
