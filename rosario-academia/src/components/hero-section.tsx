"use client";
import Image from "next/image";
import React from "react";
import Balancer from "react-wrap-balancer";

export default function HeroSection() {
  return (
    <section className="relative flex h-[60vh] w-full items-center justify-center">
      <Image
        src="https://images8.alphacoders.com/575/575648.jpg"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10 rounded-lg bg-black/0 p-8 text-center text-white">
        <Balancer className="mb-4 text-4xl  font-medium md:text-6xl">Academia Rosario</Balancer>
        <p className="mb-8 text-xl md:text-2xl">Formando campeones desde la cuna</p>
        <a
          href="/sign-up"
          className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Únete ahora
        </a>
      </div>
    </section>
  );
}
