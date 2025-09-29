"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ArrowRight } from "lucide-react";
import { DEFAULT_IMAGE } from "@/utils/utils";

interface Athlete {
  id: string;
  profiles: {
    first_name: string;
    paternal_last_name: string;
    maternal_last_name: string;
    avatar_url: string | null;
  };
  payments: {
    count: number;
    sum_amount: number;
  }[];
}

interface PaymentsListProps {
  athletes: Athlete[];
}

export function PaymentsList({ athletes }: PaymentsListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredAthletes = athletes.filter((athlete) => {
    const fullName =
      `${athlete.profiles.first_name} ${athlete.profiles.paternal_last_name} ${athlete.profiles.maternal_last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const handleRouteToAthletePayments = (athleteId: string) => {
    // Get the current path to determine if we're in admin or auxiliar section
    const currentPath = window.location.pathname;
    const isAdmin = currentPath.includes("/admin/");

    // Construct the path based on whether we're in admin or auxiliar section
    const basePath = isAdmin ? "/dashboard/admin" : "/dashboard/auxiliar";
    router.push(`${basePath}/athlete-control/payments/${athleteId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar deportista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={athlete.profiles.avatar_url || DEFAULT_IMAGE} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {athlete.profiles.first_name[0]}
                  {athlete.profiles.paternal_last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium">
                  {athlete.profiles.first_name} {athlete.profiles.paternal_last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {athlete.payments[0].count} pagos registrados
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRouteToAthletePayments(athlete.id)}
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
