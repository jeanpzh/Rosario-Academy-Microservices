"use client";
import { BenefitsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const benefits = [
  "Carnet de estudiante",
  "Acceso completo a la plataforma",
  "Entrenamientos personalizados",
  "Participación en torneos internos",
];

export default function PriceCard({ plan }: { plan: any }) {
  return (
    <div
      key={plan.nivel}
      className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl"
    >
      {/* Encabezado */}
      <div className={`relative p-6 ${plan.color} text-primary-foreground `}>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{plan.nivel}</h3>
          <span className="text-2xl">{plan.icon}</span>
        </div>
        <p className="mt-2 text-sm opacity-90">{plan.descripcion}</p>
      </div>

      <div className="p-6">
        {/* Etiqueta Ciclo Verano */}
        <div className="mb-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Ciclo Verano
          </span>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <p className="text-4xl font-bold">S/ {plan.precio}</p>
          {plan.descuento && ( // Condición para mostrar el descuento
            <p className="text-lg font-medium text-red-500">{plan.descuento}</p>
          )}
        </div>

        {/* Beneficios */}
        <ul className="mb-6 space-y-4">
          {benefits.map((beneficio, key) => (
            <li key={key} className="flex items-center gap-2">
              <BenefitsIcon />
              <span>{beneficio}</span>
            </li>
          ))}
        </ul>

        {/* Botón */}
        <Button className="text-primary-foreground   font-semibold w-full rounded-lg bg-primary py-3 transition-colors hover:bg-primary/90">
          Matricularme Ahora
        </Button>
      </div>
    </div>
  );
}
