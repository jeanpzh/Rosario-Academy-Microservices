interface PriceProps {
  nivel: string;
  descripcion: string;
  color: string;
  icon: string;
  precio: number;
  descuento?: string;
}

export const prices: PriceProps[] = [
  {
    nivel: "Anual",
    descripcion: "Para jugadores con experiencia competitiva",
    color: "bg-primary",
    icon: "🏐",
    precio: 800, // Precio para el plan Avanzado
    descuento: "¡17% de descuento!", // Mensaje de descuento para Anual
  },
  {
    nivel: "Bimestral",
    descripcion: "Para jugadores con conocimientos sólidos",
    color: "bg-primary",
    icon: "🏐",
    precio: 150, // Precio para el plan Intermedio
    descuento: "¡5% de descuento!", // Mensaje de descuento para Bimestral
  },
  {
    nivel: "Mensual",
    descripcion: "Para principiantes entusiastas",
    color: "bg-primary",
    icon: "🏐",
    precio: 80, // Precio para el plan Básico
  },
];
