import { IconBrandTabler, IconId } from "@tabler/icons-react";
import React from "react";
const links = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Control Auxiliares",
    href: "/dashboard/admin/assistant-control",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Control Deportistas",
    href: "/dashboard/admin/athlete-control",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Control de Pagos",
    href: "/dashboard/admin/athlete-control/payments",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Configuración",
    href: "/dashboard/admin/settings",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];
export default links;
