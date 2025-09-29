import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Control } from "react-hook-form";

interface EditField extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  htmlFor?: string;
  control?: Control<any>;
  name?: string;
}

export default function EditField({ label, htmlFor, control, name, ...props }: EditField) {
  const errors = control?._formState?.errors || {};
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Input {...(name ? control?.register(name) : {})} {...props} />
      {errors.phone && <span className="text-red-500">{errors.root?.message?.toString()}</span>}
    </div>
  );
}
