import { IconBrandTabler, IconId, IconUserBolt } from "@tabler/icons-react";
import { Calendar, DollarSignIcon, Settings } from "lucide-react";
import React from "react";

export const linksApproved = [
  {
    label: "Dashboard",
    href: "/dashboard/athlete",
    icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Perfil",
    href: "/dashboard/athlete/profile",
    icon: <IconUserBolt className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Horario",
    href: "/dashboard/athlete/schedule",
    icon: <Calendar className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Pagos",
    href: "/dashboard/athlete/payments",
    icon: <DollarSignIcon className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Carnet",
    href: "/dashboard/athlete/carnet",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Configuración",
    href: "/dashboard/athlete/settings",
    icon: <Settings className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];

export const linksPending = [
  {
    label: "Dashboard",
    href: "/dashboard/athlete",
    icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Perfil",
    href: "/dashboard/athlete/profile",
    icon: <IconUserBolt className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Pagos",
    href: "/dashboard/athlete/payments",
    icon: <DollarSignIcon className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];
