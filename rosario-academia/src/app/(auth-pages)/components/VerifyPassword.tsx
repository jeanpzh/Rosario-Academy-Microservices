import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface VerifyPasswordProps {
  password: string;
}

export default function VerifyPassword({ password }: VerifyPasswordProps) {
  const checks = useMemo(() => {
    return [
      { regex: /.{8,}/, label: "Al menos 8 caracteres" },
      { regex: /[a-z]/, label: "Al menos una minúscula" },
      { regex: /[A-Z]/, label: "Al menos una mayúscula" },
      { regex: /\d/, label: "Al menos un número" },
      { regex: /[!@#$%^&*()_+}{":;'?/>.<,]/, label: "Al menos un caracter especial" },
    ];
  }, []);

  const passwordStrength = useMemo(() => {
    const strength = checks.filter((check) => check.regex.test(password)).length;
    if (strength < 2) return "Débil";
    if (strength < 4) return "Media";
    return "Fuerte";
  }, [checks, password]);

  return (
    <div className="mt-4 space-y-2">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center space-x-2">
          {check.regex.test(password) ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-500" />
          )}
          <span className="text-sm">{check.label}</span>
        </div>
      ))}
      <div className="mt-2">
        <span className="text-sm font-semibold">Fortaleza de la contraseña: </span>
        <span
          className={`text-sm ${
            passwordStrength === "Débil"
              ? "text-red-500"
              : passwordStrength === "Media"
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        >
          {passwordStrength}
        </span>
      </div>
    </div>
  );
}
