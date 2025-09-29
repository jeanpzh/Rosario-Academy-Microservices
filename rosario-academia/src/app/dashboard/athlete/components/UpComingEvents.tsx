import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UpcomingEventsCard({ className }: { className?: string }) {
  const events = [
    { name: "Competencia Regional", date: "15/07/2023" },
    { name: "Taller de Técnicas Avanzadas", date: "22/07/2023" },
    { name: "Día Familiar en la Piscina", date: "05/08/2023" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="font-medium">{event.name}</span>
              <span className="text-sm text-muted-foreground">{event.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
