import { IconBrandTabler, IconId } from "@tabler/icons-react";
import { CreditCard, Settings } from "lucide-react";
import React from "react";
const links = [
  {
    label: "Dashboard",
    href: "/dashboard/auxiliar",
    icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },

  {
    label: "Control Deportistas",
    href: "/dashboard/auxiliar/athlete-control",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Control de Pagos",
    href: "/dashboard/auxiliar/athlete-control/payments",
    icon: <CreditCard className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Configuración",
    href: "/dashboard/auxiliar/settings",
    icon: <Settings className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];
export default links;
