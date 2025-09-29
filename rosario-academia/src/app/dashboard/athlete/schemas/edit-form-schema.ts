import { object, z } from "zod";

export const editFormSchema = object({
  firstName: z.string().min(1, { message: "El nombre es requerido!" }),
  paternalLastName: z.string().min(1, { message: "Apellido paterno requerido" }),
  maternalLastName: z.string().min(1, { message: "Apellido materno requerido" }),
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 caracteres" }),
});

export type TEditForm = z.infer<typeof editFormSchema>;
