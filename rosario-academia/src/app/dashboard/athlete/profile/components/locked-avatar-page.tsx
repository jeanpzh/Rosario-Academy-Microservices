import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
export default function LockedAvatarPage({ daysRemaining }: { daysRemaining: number }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300 dark:bg-[#181818]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 size-4" /> Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Cambio de Foto de Perfil Bloqueado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Lock className="mx-auto mb-4 size-16 text-muted-foreground" />
            <p className="mb-4 text-lg">
              Lo sentimos, no puedes cambiar tu foto de perfil en este momento.
            </p>
            <p className="mb-6 text-muted-foreground">
              Podrás cambiar tu foto de perfil en {daysRemaining}{" "}
              {daysRemaining === 1 ? "día" : "días"}.
            </p>
            <Button onClick={() => router.push("/dashboard/athlete/profile")}>
              Volver al Perfil
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
