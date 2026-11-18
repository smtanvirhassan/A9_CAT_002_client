import { Award, ShieldCheck, HeartHandshake, Sparkles, Star } from "lucide-react";

export function WhyChooseUs() {
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

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              The SalonBook Standard
            </span>
            <h2 className="mt-2 text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
              Why Discerning Clients Choose Us
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We believe a salon visit should be more than an appointment — it should be an oasis of relaxation and personal transformation. From our bespoke consultations to our organic treatments, every touchpoint is crafted with passion.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex flex-col gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 p-8 shadow-sm">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-500" />
              ))}
            </div>
            <blockquote className="text-base font-serif italic text-stone-800 leading-relaxed">
              &ldquo;The Hydra-Luxe Facial and Signature Blowout were pure magic. Booking online on SalonBook was completely painless, and the salon team greeted me with herbal tea the moment I arrived. I won&apos;t go anywhere else!&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="size-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm">
                ES
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Elena Sterling</p>
                <p className="text-xs text-muted-foreground">Loyal Client since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
