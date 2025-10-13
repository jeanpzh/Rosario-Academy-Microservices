import { Controller, Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useShiftQuery } from "@/hooks/use-fetch-shifts";

interface RadioFieldProps {
  control: Control<any>;
  name: string;
  labelText?: string;
}
interface LevelProps {
  id: string;
  name: string;
  description: string;
  spots: number;
}

export default function RadioFields({ control, name, labelText }: RadioFieldProps) {
  const { data, isLoading, isError } = useShiftQuery();
  if (isLoading) return <div>Cargando opciones...</div>;
  if (isError) return <div>Error al cargar opciones</div>;

  const LEVELS = Array.isArray(data) ? data : (data?.data as LevelProps[]);

  return (
    <div className="max-sm:w-[310px]">
      {labelText && <Label className="text-sm text-gray-700 dark:text-gray-300">{labelText}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue="beginner"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {LEVELS?.map((level) => (
              <div
                key={level.id}
                className="flex items-center space-x-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-black/50"
              >
                <RadioGroupItem
                  value={level.id}
                  id={level.id}
                  className="border-gray-300 text-green-500 focus:ring-green-500"
                  disabled={level.spots === 0}
                />
                <Label htmlFor={level.id} className="flex cursor-pointer flex-col gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{level.name}</span>
                  <span className="dark:text-white">{level.description}</span>
                  <Badge
                    className="w-fit font-medium"
                    variant={level.spots === 0 ? "destructive" : "default"}
                  >
                    {level.spots === 0 ? "Está lleno 🚫" : `${level.spots} lugares disponibles`}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
