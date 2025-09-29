import HomeContainer from "@/components/layout/HomeContainer";
import React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <HomeContainer>{children}</HomeContainer>;
}
