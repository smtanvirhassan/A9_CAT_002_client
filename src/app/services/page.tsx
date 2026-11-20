"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowUpDown, Scissors, Sparkles, SlidersHorizontal, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import type { IService } from "@/lib/types/service";

const allCategories = [
  "All",
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
  "Bridal & Packages",
];

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under $75", value: "under-75" },
  { label: "$75 - $150", value: "75-150" },
  { label: "$150 & Above", value: "over-150" },
];

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "duration-asc" | "duration-desc"
  >("default");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiUrl}/services?status=active`);
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(window.location.search);
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.replace(`/services?${params.toString()}`);
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesCategory =
          selectedCategory === "All" ||
          s.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
          !searchTerm.trim() ||
          s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesPrice = true;
        if (selectedPriceRange === "under-75") {
          matchesPrice = s.price < 75;
        } else if (selectedPriceRange === "75-150") {
          matchesPrice = s.price >= 75 && s.price <= 150;
        } else if (selectedPriceRange === "over-150") {
          matchesPrice = s.price > 150;
        }

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "duration-asc") return a.duration - b.duration;
        if (sortBy === "duration-desc") return b.duration - a.duration;
        return 0;
      });
  }, [services, selectedCategory, searchTerm, selectedPriceRange, sortBy]);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: services.length };
    for (const s of services) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [services]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-amber-700 mb-2">
          <Scissors className="size-4" />
          <span>Service Directory</span>
        </div>
        <h1 className="text-3xl font-serif font-light tracking-tight text-foreground sm:text-4xl">
          Browse All Salon Services
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Explore our extensive catalog of {services.length} luxury hair, skin, bridal, and body treatments. Select any service to reserve your preferred specialist and time slot.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-sm mb-8">
        {/* Top Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by treatment or keyword (e.g. Balayage, Hydra, Massage)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9.5 bg-background text-sm h-10"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              <ArrowUpDown className="size-4" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              <option value="default">Default Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Quickest First</option>
              <option value="duration-desc">Duration: Longest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills Row with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-2.5 scrollbar-none border-t border-border/40">
          <span className="text-xs font-semibold uppercase text-muted-foreground shrink-0 pr-1">
            Category:
          </span>
          {allCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-xs rounded-full px-2 py-0.2 ${
                      isSelected
                        ? "bg-amber-800 text-amber-100"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Price Budget Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-semibold uppercase text-muted-foreground shrink-0 pr-1 flex items-center gap-1">
            <DollarSign className="size-3.5" />
            Budget:
          </span>
          {priceRanges.map((range) => {
            const isSelected = selectedPriceRange === range.value;
            return (
              <button
                key={range.value}
                onClick={() => setSelectedPriceRange(range.value)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-amber-100 text-amber-900 border border-amber-300 font-semibold"
                    : "bg-background text-muted-foreground border border-border/60 hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Metadata Bar */}
      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredServices.length}</strong> matching service{filteredServices.length === 1 ? "" : "s"}
        </span>
        {(searchTerm || selectedCategory !== "All" || selectedPriceRange !== "all" || sortBy !== "default") && (
          <button
            onClick={() => {
              setSearchTerm("");
              handleCategorySelect("All");
              setSelectedPriceRange("all");
              setSortBy("default");
            }}
            className="text-amber-700 hover:underline font-medium"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl border border-border/80 bg-card p-4 space-y-4 animate-pulse">
              <div className="h-48 w-full rounded-lg bg-muted" />
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-12 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Sparkles className="mx-auto size-8 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-foreground">No matching services found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search criteria, price range, or category filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              handleCategorySelect("All");
              setSelectedPriceRange("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <main className="min-h-screen py-10 sm:py-16 bg-background">
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading services directory...</div>}>
        <BrowseServicesContent />
      </Suspense>
    </main>
  );
}
