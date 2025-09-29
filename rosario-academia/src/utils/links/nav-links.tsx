import {
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconHome,
  IconArticle,
  IconCalendarEvent,
  IconMail,
  IconUserCircle,
} from "@tabler/icons-react";

export const navigationLinks = [
  {
    title: "Inicio",
    icon: <IconHome className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#",
  },
  {
    title: "Noticias",
    icon: <IconArticle className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#noticias",
  },
  {
    title: "Planes",
    icon: <IconCalendarEvent className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#planes",
  },
  {
    title: "Eventos",
    icon: <IconCalendarEvent className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#eventos",
  },
  {
    title: "testimonios",
    icon: <IconUserCircle className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#testimonios",
  },
  {
    title: "Contacto",
    icon: <IconMail className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "#contacto",
  },
  {
    title: "WhatsApp",
    icon: <IconBrandWhatsapp className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "https://wa.me/+51978257871",
  },
  {
    title: "Facebook",
    icon: <IconBrandFacebook className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "https://www.facebook.com/people/Academia-De-Voleibol-CD-Rosario/100062953882723/",
  },
  {
    title: "Instagram",
    icon: <IconBrandInstagram className="size-full text-neutral-500 dark:text-neutral-300" />,
    href: "https://instagram.com",
  },
];
