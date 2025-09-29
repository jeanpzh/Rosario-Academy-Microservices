"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AthleteDistribution } from "@/app/dashboard/components/athletes/AthleteDistribution";
import Profile from "@/app/dashboard/components/Profile";
import {
  BookOpen,
  GraduationCap,
  Users,
  Bell,
  FileText,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full transition-colors hover:border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-muted-foreground group-hover:text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AuxiliarDashboardPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Bienvenido al Panel de Auxiliar</h1>
        <p className="text-muted-foreground">
          Gestiona deportistas y accede a recursos importantes desde aquí
        </p>
      </div>

      {/* Profile and Distribution Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tu Perfil</CardTitle>
            <CardDescription>Información y estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <Profile />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Deportistas</CardTitle>
            <CardDescription>Vista general por niveles</CardDescription>
          </CardHeader>
          <CardContent>
            <AthleteDistribution />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Acciones Rápidas</h2>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <QuickActionCard
            icon={Users}
            title="Gestionar Deportistas"
            description="Registra, actualiza y gestiona perfiles de deportistas"
            href="/dashboard/auxiliar/athlete-control"
          />
          <QuickActionCard
            icon={Settings}
            title="Configuración de Cuenta"
            description="Actualiza tu contraseña"
            href="/dashboard/auxiliar/settings"
          />
        </div>
      </div>

      {/* Resources and Help Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recursos y Ayuda</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={BookOpen}
            title="Guías y Manuales"
            description="Accede a documentación detallada sobre procesos y procedimientos"
          />
          <InfoCard
            icon={GraduationCap}
            title="Capacitación"
            description="Recursos de aprendizaje y materiales de entrenamiento"
          />
          <InfoCard
            icon={Bell}
            title="Últimas Actualizaciones"
            description="Novedades y cambios recientes en el sistema"
          />
          <InfoCard
            icon={HelpCircle}
            title="Centro de Ayuda"
            description="Encuentra respuestas a preguntas frecuentes"
          />
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Consejos y Mejores Prácticas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="size-5 text-yellow-500" />
                <CardTitle className="text-base">Consejos del Día</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <p className="text-sm">
                    Mantén actualizada la información de los deportistas regularmente
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <p className="text-sm">Verifica la asistencia al inicio de cada sesión</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <p className="text-sm">Comunica cualquier incidencia al entrenador responsable</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-blue-500" />
                <CardTitle className="text-base">Documentos Importantes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Protocolo de Emergencias</li>
                <li>• Reglamento Interno</li>
                <li>• Formularios de Registro</li>
                <li>• Calendario de Competencias</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
