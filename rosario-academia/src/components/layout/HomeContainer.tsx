"use server";
import React from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default async function HomeContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center gap-5">
        <HomeHeader />
        <div className="flex flex-col gap-20 p-5"> {children}</div>
        <HomeFooter />
      </div>
    </main>
  );
}
