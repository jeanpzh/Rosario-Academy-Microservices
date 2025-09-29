"use client";

import { Users, Building2, Trophy } from "lucide-react";
import FeatureItem from "@/components/feature-item";

export default function HomeFooter() {
  const features = [
    {
      icon: Users,
      title: "Entrenadores Expertos",
      description: "Aprende de los mejores profesionales del vóley",
    },
    {
      icon: Building2,
      title: "Instalaciones de Primera",
      description: "Entrena en canchas de alta calidad y con equipamiento moderno",
    },
    {
      icon: Trophy,
      title: "Ambiente Motivador",
      description: "Únete a una comunidad apasionada por el vóley",
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/50 to-secondary">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary">
            ¿Por qué elegirnos?
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-primary/30" />
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
