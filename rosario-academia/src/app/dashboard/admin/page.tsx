"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AthleteDistribution } from "@/app/dashboard/components/athletes/AthleteDistribution";
import Profile from "@/app/dashboard/components/Profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCog } from "lucide-react";
import type React from "react";
import { useCountAthletesQuery } from "@/hooks/use-fetch-count-athletes-count";
import { useCountAssistantQuery } from "@/hooks/use-fetch-assistant-count";

function ControlCard({
  title,
  description,
  href,
  buttonText,
  count,
  icon: Icon,
  loading,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  count: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-56" />;
  }
  return (
    <Card className="flex h-56 flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="text-3xl font-bold">{count}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Link
          href={href}
          className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: athletesCount = 0, isLoading: isLoadingAthletes } = useCountAthletesQuery();

  const { data: assistantsCount = 0, isLoading: isLoadingAssistants } = useCountAssistantQuery();
  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Atletas</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AthleteDistribution />
          </CardContent>
        </Card>
        <Profile />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ControlCard
          title="Control de Atletas"
          description="Accede al control completo de atletas para gestionar perfiles, niveles y estados."
          href="/dashboard/athletes"
          buttonText="Ir a Control de Atletas"
          count={athletesCount}
          icon={Users}
          loading={isLoadingAthletes}
        />
        <ControlCard
          title="Control de Auxiliares"
          description="Gestiona los perfiles y permisos de los auxiliares administrativos."
          href="/dashboard/admin/assistant-control"
          buttonText="Ir a Control de Auxiliares"
          count={assistantsCount}
          icon={UserCog}
          loading={isLoadingAssistants}
        />
      </div>
    </div>
  );
}
