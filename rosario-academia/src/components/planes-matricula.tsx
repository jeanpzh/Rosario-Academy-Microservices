import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, VibrateIcon as Volleyball } from "lucide-react";

const planes = [
  {
    nivel: "Avanzado",
    descripcion: "Para jugadores con experiencia competitiva",
    color: "bg-primary dark:bg-primary/80",
  },
  {
    nivel: "Intermedio",
    descripcion: "Para jugadores con conocimientos sólidos",
    color: "bg-secondary dark:bg-secondary/80",
  },
  {
    nivel: "Básico",
    descripcion: "Para principiantes entusiastas",
    color: "bg-accent dark:bg-accent/80",
  },
];

const beneficios = [
  "Carnet de estudiante",
  "Acceso completo a la plataforma",
  "Entrenamientos personalizados",
  "Participación en torneos internos",
];

export function PlanesMatricula() {
  return (
    <section id="planes" className="w-full max-w-7xl py-16 text-foreground">
      <h2 className="mb-8 text-center text-3xl font-bold text-primary dark:text-primary-foreground">
        Planes y Matrícula - Vóley Verano
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {planes.map((plan) => (
          <Card
            key={plan.nivel}
            className="flex flex-col shadow-md transition-shadow hover:shadow-lg dark:border-primary/20 dark:bg-card"
          >
            <CardHeader className={`${plan.color} text-primary-foreground`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{plan.nivel}</CardTitle>
                <Volleyball size={32} />
              </div>
              <CardDescription className="text-primary-foreground/90 dark:text-primary-foreground/80">
                {plan.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="grow pt-6">
              <Badge className="mb-4 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                Ciclo Verano
              </Badge>
              <p className="mb-6 text-3xl font-bold dark:text-primary-foreground">S/ 80</p>
              <ul className="space-y-2">
                {beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle
                      className="mr-2 text-primary dark:text-primary-foreground"
                      size={20}
                    />
                    <span className="dark:text-primary-foreground/90">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70">
                Matricularme Ahora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
