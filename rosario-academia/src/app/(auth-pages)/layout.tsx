import HomeContainer from "@/components/layout/HomeContainer";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <HomeContainer>{children}</HomeContainer>;
}
