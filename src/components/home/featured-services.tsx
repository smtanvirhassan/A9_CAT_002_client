"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import type { IService } from "@/lib/types/service";

interface FeaturedServicesProps {
  services: IService[];
}

const filterTabs = [
  { label: "All Featured", category: "all" },
  { label: "Hair & Styling", category: "Haircut & Styling" },
  { label: "Color & Highlights", category: "Hair Coloring" },
  { label: "Facials & Skin", category: "Facial & Skincare" },
  { label: "Spa & Massage", category: "Spa & Massage" },
  { label: "Bridal & Packages", category: "Bridal & Packages" },
];

export function FeaturedServices({ services }: FeaturedServicesProps) {
  const [activeTab, setActiveTab] = useState("all");

  const displayedServices =
    activeTab === "all"
      ? services
      : services.filter(
          (s) => s.category.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-amber-700 mb-2">
              <Sparkles className="size-4" />
              <span>Curated Care</span>
            </div>
            <h2 className="text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
              Featured Salon Services
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-xl">
              Choose from our most requested haircutting, restorative conditioning, and luxury spa treatments, performed by industry masters.
            </p>
          </div>

          <Link href="/services">
            <Button
              variant="amber"
              className="group rounded-full px-6 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-amber-700/20 transition-all duration-300"
            >
              <span>Explore Complete Menu</span>
              <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/40 scrollbar-none">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground pr-2 hidden sm:flex">
            <SlidersHorizontal className="size-4" />
            <span>Filter:</span>
          </div>
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.category;
            return (
              <button
                key={tab.category}
                onClick={() => setActiveTab(tab.category)}
                className={`shrink-0 rounded-full px-4.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-700 text-white shadow-sm scale-105"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {displayedServices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No services found in this category.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("all")}
              className="mt-3"
            >
              Show All Services
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedServices.slice(0, 8).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-900/40 p-6 sm:p-8">
              <div>
                <h3 className="text-xl font-serif font-medium text-foreground">
                  Looking for our complete treatment catalog?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Explore all 31 luxury salon, hair artistry, aesthetician, and wellness experiences.
                </p>
              </div>
              <Link href="/services" className="shrink-0">
                <Button
                  variant="amber"
                  className="group rounded-full px-7 py-3 text-base font-semibold shadow-md hover:shadow-xl hover:shadow-amber-700/25 transition-all duration-300"
                >
                  <span>Explore Complete Menu</span>
                  <ArrowRight className="ml-2 size-4.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
