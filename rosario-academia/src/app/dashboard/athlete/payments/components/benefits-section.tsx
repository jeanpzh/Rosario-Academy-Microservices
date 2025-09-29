"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, HelpCircle, PhoneCall } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: GraduationCap,
      title: "Beneficios de tu matrícula",
      content: ["Acceso a todas las clases", "Materiales de estudio", "Asesoría académica"],
    },
    {
      icon: HelpCircle,
      title: "Ayuda sobre pagos",
      content: ["Si tienes dudas sobre tus pagos, visita nuestra sección de Preguntas Frecuentes."],
    },
    {
      icon: PhoneCall,
      title: "Contáctanos",
      content: ["¿Problemas con tu pago? Llámanos al 977849277 o escríbenos a fisib22@gmail.com"],
    },
  ];

  return (
    <div className="space-y-4">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <benefit.icon className="mr-2 size-5" />
                {benefit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(benefit.content) ? (
                <ul className="list-inside list-disc space-y-1">
                  {benefit.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{benefit.content}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
