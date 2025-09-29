"use client";
import { FloatingDock } from "@/components/ui/floating-dock";
import AnimatedTestimonials from "@/components/ui/animated-testimonials";
import { testimonials } from "@/utils/mock-data/testimonials";
import { navigationLinks } from "@/utils/links/nav-links";
import { prices } from "@/utils/mock-data/prices";
import { news } from "@/utils/mock-data/news";
import FeaturedNews from "@/components/featured-news";
import PriceCard from "@/components/price-card";
import { upcomingEvents } from "@/utils/mock-data/upcoming-events";
import UpcomingEvents from "@/components/upcoming-events";
import HeroSection from "@/components/hero-section";

export default function HomeMain() {
  return (
    <div className="flex flex-col items-center gap-16">
      {/* Hero Section */}

      <HeroSection />

      {/* Noticias Destacadas */}

      <section id="noticias" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary">Noticias Destacadas</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {news.map((noticia, key) => (
            <FeaturedNews key={key} noticia={noticia} />
          ))}
        </div>
      </section>

      {/* Planes - Matrícula */}

      <section id="planes" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary">Planes - Matrícula</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {prices.map((plan, key) => (
            <PriceCard key={key} plan={plan} />
          ))}
        </div>
      </section>

      {/* Próximos Eventos */}

      <section id="eventos" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold">Próximos Eventos</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {upcomingEvents.map((event, key) => (
            <UpcomingEvents key={key} {...event} />
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="w-full max-w-7xl py-8">
        <h2 className="mb-4 text-center text-3xl font-bold">Torneos Ganados</h2>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      {/* FloatingDock */}
      <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
        <FloatingDock
          items={navigationLinks}
          desktopClassName="w-full"
          mobileClassName="mx-auto flex justify-center"
        />
      </div>
    </div>
  );
}
