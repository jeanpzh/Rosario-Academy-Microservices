import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CarnetCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Carné de Estudiante</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Tu carné digital está listo.</p>
        <Button>
          <Link href="/dashboard/athlete/carnet">Ver Carné</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
