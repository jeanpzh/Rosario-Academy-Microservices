import TextField from "@/app/(auth-pages)/components/TextField";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AssistantFormData,
  assistantFormSchema,
} from "@/app/dashboard/admin/schemas/assistant-schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddAssistantQuery } from "@/hooks/use-add-assistant";
import { useUpdateAssistant } from "@/hooks/use-update-assistant";
import { useAssistantStore } from "@/lib/stores/useAssistantStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@/components/ui/dialog";
export default function AssistantForm({ mode }: { mode: "create" | "edit" | undefined }) {
  const { control, reset, handleSubmit } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema),
  });
  const { currentItem: currentAssistant } = useAssistantStore();

  // For Assistant Sign Up from Table
  const postMutation = useAddAssistantQuery();
  // For PUT request, update Assistant
  const updateMutation = useUpdateAssistant();

  const onSubmit = async (data: AssistantFormData) => {
    try {
      if (mode === "create") postMutation.mutate(data);
      else if (mode === "edit") updateMutation.mutate(data);
    } catch (error) {
      toast.error("Error", {
        description: "Hubo un problema al guardar los datos. Por favor, intenta de nuevo.",
        duration: 5000,
      });
    }
  };

  // Render fields based on mode -> "create" | "edit"
  useEffect(() => {
    if (mode === "create") {
      reset({
        first_name: "",
        paternal_last_name: "",
        maternal_last_name: "",
        birth_date: "",
        dni: "",
        phone: "",
        email: "",
      });
    } else if (mode === "edit" && currentAssistant) {
      // if mode is edit, set the fields with the current item data
      const assistant = currentAssistant as AssistantFormData;
      reset({
        first_name: assistant.first_name,
        paternal_last_name: assistant.paternal_last_name,
        maternal_last_name: assistant.maternal_last_name,
        birth_date: assistant.birth_date,
        dni: assistant.dni,
        phone: assistant.phone,
        email: assistant.email,
      });
    }
  }, [mode, reset, currentAssistant]);
  return (
    <>
      <DialogTitle>
        {mode === "create" ? "Nuevo Auxiliar Administrativo" : "Editar Auxiliar"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <TextField
          label="Nombre"
          placeholder="Nombre"
          control={control}
          name="first_name"
          htmlFor="first_name"
        />
        <TextField
          label="Apellido Paterno"
          placeholder="Apellido Paterno"
          control={control}
          name="paternal_last_name"
          htmlFor="paternal_last_name"
        />
        <TextField
          label="Apellido Materno"
          placeholder="Apellido Materno"
          control={control}
          name="maternal_last_name"
          htmlFor="maternal_last_name"
        />
        <TextField
          label="Fecha de Nacimiento"
          placeholder="Fecha de Nacimiento"
          control={control}
          name="birth_date"
          htmlFor="birth_date"
          type="date"
        />
        <TextField label="DNI" placeholder="DNI" control={control} name="dni" htmlFor="dni" />

        <TextField
          label="Teléfono"
          placeholder="Teléfono"
          control={control}
          name="phone"
          htmlFor="phone"
        />
        <TextField
          label="Correo Electrónico"
          placeholder="Correo Electrónico"
          control={control}
          name="email"
          htmlFor="email"
          readOnly={mode === "edit"}
        />
        <Button type="submit" className="col-span-2">
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </form>
    </>
  );
}
