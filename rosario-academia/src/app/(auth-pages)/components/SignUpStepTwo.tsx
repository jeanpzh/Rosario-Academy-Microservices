import React from "react";
import RadioFields from "@/app/(auth-pages)/components/RadioFields";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { useFormContext } from "react-hook-form";
import { SignUpSchema } from "@/app/(auth-pages)/schemas/sign-up-schema";

export default function SignUpStepTwo({
  onPrevStep,
  pending,
}: {
  onPrevStep: () => void;
  pending: boolean;
}) {
  const { control } = useFormContext<SignUpSchema>();
  return (
    <div className="space-y-6">
      <RadioFields control={control} name="level" labelText="Niveles" />
      <div className="flex justify-between gap-4">
        <HoverBorderGradient onClick={onPrevStep} className=" w-full" containerClassName="w-full">
          Atrás
        </HoverBorderGradient>
        <HoverBorderGradient className="w-full" containerClassName="w-full">
          {pending ? "Registrando..." : "Registrar"}
        </HoverBorderGradient>
      </div>
    </div>
  );
}
