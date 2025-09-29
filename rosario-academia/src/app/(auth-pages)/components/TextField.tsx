import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface TextFieldProps extends React.HTMLProps<HTMLInputElement> {
  htmlFor: string;
  label: string;
  control: Control<any>;
  name: string;
  options?: string[];
  type?: string;
}

export default function TextField({
  htmlFor,
  label,
  control,
  name,
  options,
  type = "text",
  ...props
}: TextFieldProps) {
  const {
    _formState: { errors },
  } = control;
  return (
    <div className="mb-3 max-sm:w-[310px]">
      <Label htmlFor={htmlFor}>{label}</Label>

      {type === "select" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <Input {...control.register(name)} type={type} {...props} />
      )}

      {errors[name] && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {errors[name].message?.toString()}
        </p>
      )}
    </div>
  );
}
