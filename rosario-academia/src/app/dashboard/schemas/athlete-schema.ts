import * as z from "zod";

export const athleteFormSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  paternal_last_name: z.string().min(1, "El apellido paterno es requerido"),
  maternal_last_name: z.string().min(1, "El apellido materno es requerido"),
  birth_date: z.string().min(1, "La fecha de nacimiento es requerida"),
  dni: z.string().min(1, "El DNI es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Correo electrónico inválido").nullable().optional(),
  avatar_url: z.union([
    z.string().url("Debe ser una URL válida").optional(),
    z.string().length(0).optional(),
    z.instanceof(Blob, { message: "Debe ser un blob válido" }).optional(),
    z.null(),
    z.undefined(),
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

export type AthleteFormData = z.infer<typeof athleteFormSchema>;
