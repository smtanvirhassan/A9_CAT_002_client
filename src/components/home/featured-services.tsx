import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import type { IService } from "@/lib/types/service";

interface FeaturedServicesProps {
  services: IService[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
              <Sparkles className="size-3.5" />
              <span>Curated Care</span>
            </div>
            <h2 className="text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
              Featured Salon Services
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Choose from our most requested haircutting, restorative conditioning, and luxury spa treatments, performed by industry masters.
            </p>
          </div>

          <Link href="/services">
            <Button variant="outline" className="group">
              <span>View All Services</span>
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No featured services currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
