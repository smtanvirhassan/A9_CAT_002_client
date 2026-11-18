import { Award, ShieldCheck, HeartHandshake, Sparkles, Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The Hydra-Luxe Facial and Signature Blowout were pure magic. Booking online on SalonBook was completely painless, and the salon team greeted me with herbal tea the moment I arrived. I won't go anywhere else!",
    author: "Elena Sterling",
    role: "Loyal Client • 14 Appointments",
    service: "Hydra-Luxe Facial & Blowout",
    initials: "ES",
    rating: 5,
  },
  {
    quote:
      "Finding a salon that does authentic Balayage without damaging hair is rare. SalonBook paired me with Master Colorist Julian and the results exceeded every expectation. The checkout via Stripe was effortless.",
    author: "Marcus Vance",
    role: "Verified Client • 8 Appointments",
    service: "Balayage & Glaze Color",
    initials: "MV",
    rating: 5,
  },
  {
    quote:
      "The VIP Couples Sanctuary package was the ultimate anniversary gift. The private hot stone suite and organic aromatherapy oils melted weeks of work stress away. Truly world-class hospitality.",
    author: "Sophia & Liam Chen",
    role: "VIP Member • Since 2023",
    service: "Couples Oasis Escape",
    initials: "SC",
    rating: 5,
  },
];

const features = [
  {
    icon: Award,
    title: "Master Certified Stylists",
    description: "Our artists hold prestigious global certifications from Vidal Sassoon, Aveda, and Wella Professionals.",
  },
  {
    icon: ShieldCheck,
    title: "Medical-Grade Hygiene",
    description: "Hospital-grade autoclaves sterilize every instrument, ensuring the cleanest salon experience possible.",
  },
  {
    icon: Sparkles,
    title: "Organic & Clean Products",
    description: "We use ammonia-free, paraben-free, cruelty-free vegan formulations that nurture your scalp and skin.",
  },
  {
    icon: HeartHandshake,
    title: "Seamless Digital Experience",
    description: "Schedule anytime with real-time slot checking, instant confirmations, and secure Stripe checkout.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            The SalonBook Standard
          </span>
          <h2 className="mt-2 text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
            Why Discerning Clients Choose Us
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We believe a salon visit should be more than an appointment — it should be an oasis of relaxation, craftsmanship, and personal transformation.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-400/50"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800 mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Expanded 3 Verified Testimonials Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-medium text-foreground">
                Stories From Our Cherished Guests
              </h3>
              <p className="text-xs text-muted-foreground">
                Rated 4.9/5 stars across 2,500+ verified customer appointments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-amber-100/20 p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <Quote className="size-5 text-amber-300/80" />
                  </div>

                  <p className="text-xs font-serif italic text-stone-700 leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-amber-200/80 flex items-center justify-center font-bold text-amber-900 text-xs shadow-xs">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.author}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
