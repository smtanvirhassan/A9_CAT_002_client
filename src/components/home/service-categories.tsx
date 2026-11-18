import Link from "next/link";
import { Scissors, Palette, Sparkles, Smile, Heart, Hand, Flower2, Crown } from "lucide-react";

const categories = [
  {
    name: "Haircut & Styling",
    description: "Precision cuts, bespoke blowouts & styling",
    icon: Scissors,
    serviceCount: "4 Treatments",
  },
  {
    name: "Hair Coloring",
    description: "Balayage, gloss toner, foil highlights & color melt",
    icon: Palette,
    serviceCount: "4 Treatments",
  },
  {
    name: "Hair Treatment",
    description: "Keratin smooth, olaplex bond builder & scalp detox",
    icon: Sparkles,
    serviceCount: "4 Treatments",
  },
  {
    name: "Facial & Skincare",
    description: "Hydrafacials, 24K gold firming & diamond micropeels",
    icon: Smile,
    serviceCount: "4 Treatments",
  },
  {
    name: "Makeup",
    description: "Evening glam, bridal trials & keratin lash lifts",
    icon: Heart,
    serviceCount: "4 Treatments",
  },
  {
    name: "Manicure & Pedicure",
    description: "Artisan gel nails, Russian manicures & herbal foot spa",
    icon: Hand,
    serviceCount: "4 Treatments",
  },
  {
    name: "Spa & Massage",
    description: "Deep tissue, warm Himalayan salt stones & detox wraps",
    icon: Flower2,
    serviceCount: "4 Treatments",
  },
  {
    name: "Bridal & Packages",
    description: "Royal bridal sanctuary, couples retreats & grooming packages",
    icon: Crown,
    serviceCount: "3 Packages",
  },
];

export function ServiceCategories() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Explore By Speciality
          </span>
          <h2 className="mt-2 text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
            Salon Service Categories
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Browse our full catalog of professional beauty, grooming, and rejuvenation services tailored to your aesthetic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-amber-400/60"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                      {cat.serviceCount}
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-foreground group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-amber-700">
                  <span>Browse Category</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
