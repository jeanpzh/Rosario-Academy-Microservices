interface UpcomingEventsProps {
  title: string;
  date: string;
  place: string;
  imageUrl: string;
  alt: string;
}

export const upcomingEvents: UpcomingEventsProps[] = [
  {
    title: "Charla Informativa - Expositor Said William",
    date: "Fecha: 14 de Febrero, 2025",
    place: "Sede Rosario",
    imageUrl: "https://www.businessempresarial.com.pe/wp-content/uploads/2024/07/evento.jpg",
    alt: "torneo",
  },
  {
    title: "Sesión de entrenamiento gratis para UNMSM",
    date: "Fecha: 10 de Febrero, 2025",
    place: "Puerta 1",
    imageUrl: "https://ogbu.unmsm.edu.pe/wp-content/uploads/2022/05/MG_9827-scaled.jpg",
    alt: "competencia",
  },
];
