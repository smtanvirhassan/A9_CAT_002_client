import Link from "next/link";
import { Scissors, Palette, Sparkles, Smile, Heart, Hand, Flower2 } from "lucide-react";

const categories = [
  {
    name: "Haircut & Styling",
    description: "Precision cuts, bespoke blowouts & bridal up-dos",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hair Coloring",
    description: "Balayage, gloss toner, foil highlights & color correction",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hair Treatment",
    description: "Keratin smooth, olaplex bond builder & deep scalp therapy",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Facial & Skincare",
    description: "Hydrafacials, anti-aging peels & microdermabrasion",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Makeup",
    description: "Evening glam, editorial makeup & permanent lash lift",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Manicure & Pedicure",
    description: "Artisan gel nails, paraffin wax & luxury foot spa",
    icon: Hand,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Spa & Massage",
    description: "Swedish massage, hot stone therapy & body scrubs",
    icon: Flower2,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-amber-400/60"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-amber-700">
                  <span>View Services</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
