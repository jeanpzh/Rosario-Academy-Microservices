interface NewsProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export const news: NewsProps[] = [
  {
    id: 1,
    title: "Gran victoria en el torneo local",
    description: "Nuestro equipo logró una impresionante victoria...",
    imageUrl:
      "https://movistardeportes.pe/wp-content/uploads/sites/2/2023/10/Proyecto-nuevo-42.jpg",
  },
  {
    id: 2,
    title: "Nuevo programa de entrenamiento",
    description: "Implementamos un innovador programa de entrenamiento...",
    imageUrl:
      "https://wallpapers.com/images/high/volleyball-4k-bright-orange-sunset-abm145nfqiprnr0n.webp",
  },
  {
    id: 3,
    title: "Reconocimiento a nuestros atletas",
    description: "Tres de nuestros atletas fueron nominados para...",
    imageUrl:
      "https://wallpapers.com/images/high/girl-spiking-midair-volleyball-4k-iii24yjkmb6ghp9y.webp",
  },
];
