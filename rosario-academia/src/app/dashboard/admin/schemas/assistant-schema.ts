import * as z from "zod";

export const assistantFormSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  paternal_last_name: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno no puede exceder 50 caracteres"),
  maternal_last_name: z
    .string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno no puede exceder 50 caracteres"),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  dni: z.string().length(8, "El DNI debe tener 8 dígitos"),
  phone: z.string().length(9, "El teléfono debe tener 9 dígitos"),
  email: z.string().email("Correo electrónico inválido"),
});

export type AssistantFormData = z.infer<typeof assistantFormSchema>;
