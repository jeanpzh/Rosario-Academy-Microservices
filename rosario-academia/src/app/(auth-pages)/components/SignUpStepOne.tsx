import React from "react";
import Link from "next/link";
import { FORM_FIELDS_STEP_ONE } from "@/app/(auth-pages)/fields";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import TextField from "@/app/(auth-pages)/components/TextField";
import VerifyPassword from "@/app/(auth-pages)/components/VerifyPassword";
import { useFormContext } from "react-hook-form";
import { SignUpSchema } from "@/app/(auth-pages)/schemas/sign-up-schema";
import PasswordInput from "@/components/password-input";

export default function SignUpStepOne({ onNext }: { onNext: () => void }) {
  const { control, watch } = useFormContext<SignUpSchema>();
  return (
    <div className="space-y-6">
      <p className=" text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Inicia sesión
        </Link>
      </p>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {FORM_FIELDS_STEP_ONE.filter(
          (field) => !["password", "confirmPassword", "email"].includes(field.name),
        ).map((field, index) => (
          <TextField
            className="max-sm:p-2"
            key={index}
            htmlFor={field.name}
            control={control}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <div className="w-full">
        <TextField
          htmlFor="email"
          control={control}
          name="email"
          label="Correo Electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="space-y-4">
        <PasswordInput control={control} label="Contraseña" name="password" />
        <VerifyPassword password={watch("password", "")} />

        <PasswordInput control={control} label="Confirmar Contraseña" name="confirmPassword" />
      </div>

      <HoverBorderGradient onClick={onNext} className="w-full" containerClassName="w-full">
        Siguiente
      </HoverBorderGradient>
    </div>
  );
}
