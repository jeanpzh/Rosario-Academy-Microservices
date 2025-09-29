"use client";
interface UpcomingEventsProps {
  title: string;
  date: string;
  place: string;
  imageUrl: string;
  alt: string;
}

export default function UpcomingEvents(event: UpcomingEventsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card p-6 text-card-foreground shadow-md transition-transform hover:scale-105">
      <img src={event.imageUrl} alt={event.alt} className="mb-4 h-60 w-full rounded object-cover" />
      <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
      <p className="mb-2 text-muted-foreground">Fecha: {event.date}</p>
      <p className="mb-4 text-muted-foreground">Lugar: {event.place}</p>
      <button className="w-full rounded-lg bg-primary py-3 text-lg font-semibold text-primary-foreground  transition-colors hover:bg-primary/90">
        Más información
      </button>
    </div>
  );
}
