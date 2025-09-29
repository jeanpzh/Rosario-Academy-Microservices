"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PaymentCard({ availableDate }: { availableDate: string | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Próximo pago: {availableDate}</p>
        <p className="mb-4">Monto: S/80.00</p>
        <Link href="/dashboard/athlete/payments">
          <Button>Ver pagos</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
