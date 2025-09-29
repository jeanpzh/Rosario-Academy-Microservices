import { object, z } from "zod";

export const signUpSchema = object({
  firstName: z.string().min(1, { message: "El nombre es requerido!" }),
  paternalLastName: z.string().min(1, { message: "Apellido paterno requerido" }),
  maternalLastName: z.string().min(1, { message: "Apellido materno requerido" }),
  birthDate: z
    .string()
    .min(1, { message: "Fecha de nacimiento requerida" })
    .refine(
      (value) => {
        const date = new Date(value);
        const currentYear = new Date().getFullYear();
        const birthYear = date.getFullYear();
        return birthYear <= currentYear - 6 && birthYear >= currentYear - 20;
      },
      { message: "Edad permitida entre 6 y 20 años" },
    )
    .transform((value) => new Date(value).toISOString()),

  dni: z.string().min(8, { message: "DNI posee 8 digitos" }),
  email: z
    .string()
    .email({ message: "Email invalido" })
    .refine(
      (value) => {
        const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com"];
        return allowedDomains.some((domain) => value.endsWith(domain));
      },
      {
        message: "Solo se permiten los dominios @gmail.com, @hotmail.com, @outlook.com",
      },
    ),
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 caracteres" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/, {
      message:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial",
    }),
  confirmPassword: z.string().min(1, { message: "La confirmación de contraseña es requerida" }),
  level: z.enum(["beginner", "intermediate", "advanced"]),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password && password.length >= 8 && password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    });
  }
});

// Infer the type
export type SignUpSchema = z.infer<typeof signUpSchema>;
