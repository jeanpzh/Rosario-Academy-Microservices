"use client";

import { useResetPasswordRequest } from "@/hooks/auth/use-reset-password-request";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const { mutate: resetPassword, isPending } = useResetPasswordRequest();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }
    resetPassword(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full min-w-64 max-w-64 flex-1 flex-col gap-2 text-foreground [&>input]:mb-6"
    >
      <div>
        <h1 className="text-2xl font-medium">Cambiar contraseña</h1>
        <p className="text-sm text-secondary-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link className="text-primary underline" href="/sign-in">
            Loggeate
          </Link>
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SubmitButton pending={isPending}>Resetear contraseña</SubmitButton>
      </div>
    </form>
  );
}
