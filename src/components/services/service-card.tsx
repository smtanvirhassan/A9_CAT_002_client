import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IService } from "@/lib/types/service";

interface ServiceCardProps {
  service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-400/50">
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <span className="absolute top-3 left-3 rounded-full bg-amber-900/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-100 shadow-sm">
          {service.category}
        </span>
        <span className="absolute bottom-3 right-3 rounded-md bg-white/95 px-2.5 py-1 text-sm font-bold text-amber-900 shadow-md">
          ${service.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-amber-800 line-clamp-1">
            {service.serviceName}
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4 text-amber-600" />
            <span>{service.duration} mins treatment</span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border/50">
          <Link href={`/services/${service._id}`} className="block">
            <Button
              variant="outline"
              className="w-full justify-between text-sm font-semibold group-hover:bg-amber-700 group-hover:text-white group-hover:border-amber-700 transition-colors py-2"
            >
              <span>View Details</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
