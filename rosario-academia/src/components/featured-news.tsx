"use client";
import React from "react";

export default function FeaturedNews({ noticia }: { noticia: any }) {
  return (
    <div
      key={noticia.id}
      className="overflow-hidden rounded-lg border border-primary/20 bg-card text-card-foreground shadow-md transition-transform hover:scale-105"
    >
      <img
        src={noticia.imageUrl || "/placeholder.svg"}
        alt={noticia.title}
        className="h-56 w-full object-cover"
      />
      <div className="p-7">
        <h3 className="mb-2 text-xl font-semibold">{noticia.title}</h3>
        <p className="mb-16 text-muted-foreground">{noticia.description}</p>
        <a href="#" className="text-primary transition-colors hover:text-primary/80">
          Leer más
        </a>
      </div>
    </div>
  );
}
