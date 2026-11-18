import { Banner } from "@/components/home/banner";
import { MarqueeSection } from "@/components/home/marquee-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { ServiceCategories } from "@/components/home/service-categories";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import type { IService } from "@/lib/types/service";

async function getFeaturedServices(): Promise<IService[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/services/featured`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching featured services:", err);
    return [];
  }
}

export default async function HomePage() {
  const featuredServices = await getFeaturedServices();

  return (
    <main className="min-h-screen">
      <Banner />
      <MarqueeSection />
      <FeaturedServices services={featuredServices} />
      <ServiceCategories />
      <WhyChooseUs />
    </main>
  );
}
