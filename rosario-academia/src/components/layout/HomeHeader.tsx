"use server";
import React from "react";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function HomeHeader() {
  return (
    <nav className="sticky top-0 z-20 w-full border-b border-b-foreground/10 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between p-3 px-5">
        <div className="flex items-center gap-8">
          <Link
            href={"/"}
            className="text-xl font-bold text-primary transition-colors hover:text-primary/80"
          >
            Academia Rosario
          </Link>
          <div className="hidden space-x-4 md:flex">
            <a
              href="#noticias"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Noticias
            </a>
            <a href="#eventos" className="text-sm font-medium transition-colors hover:text-primary">
              Eventos
            </a>
            <a
              href="#testimonios"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Galería
            </a>
            <a
              href="#contacto"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contacto
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <HeaderAuth />
        </div>
      </div>
    </nav>
  );
}
