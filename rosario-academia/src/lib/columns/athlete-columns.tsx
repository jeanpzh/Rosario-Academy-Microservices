import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Athlete } from "@/lib/types/AthleteTable";
import { DeleteAlert } from "@/app/dashboard/components/DeleteAlert";
import { LevelToSpanish } from "@/app/dashboard/athlete/profile/types";

export const athleteColumns = (
  handleEdit: (athlete: Athlete) => void,
  handleDelete: (athlete: Athlete) => void,
  updateAthleteLevelMutation: any,
  updateAthleteStatusMutation: any,
  levelColors: Record<string, string>,
  statusColors: Record<string, string>,
): ColumnDef<Athlete>[] => {
  return [
    {
      accessorKey: "avatar_url",
      header: "Avatar",
      cell: ({ row }) => (
        <Image
          src={
            row.original.avatar_url ||
            "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png"
          }
          alt={`${row.original.first_name} ${row.original.paternal_last_name}`}
          width={40}
          height={40}
          className="rounded-full"
        />
      ),
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "paternal_last_name",
      header: "Apellido Paterno",
    },
    {
      accessorKey: "maternal_last_name",
      header: "Apellido Materno",
    },
    {
      accessorKey: "birth_date",
      header: "Fecha de Nacimiento",
      cell: ({ row }) => new Date(row.original.birth_date).toLocaleDateString(),
    },
    {
      accessorKey: "dni",
      header: "DNI",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "level",
      header: "Nivel",
      cell: ({ row }) => (
        <Select
          value={row.original.level}
          onValueChange={(value) =>
            updateAthleteLevelMutation.mutate({ id: row.original.id, level: value as string })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge className={`${levelColors[row.original.level]} text-black dark:text-white`}>
                {LevelToSpanish[row.original.level as keyof typeof LevelToSpanish]}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(value) =>
            updateAthleteStatusMutation.mutate({ id: row.original.id, status: value as string })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge className={`${statusColors[row.original.status]} text-black dark:text-white`}>
                {row.original.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => handleEdit(row.original)}
            className="flex items-center"
            variant="ghost"
          >
            <Pencil className="size-4" />
          </Button>
          <DeleteAlert onDeleteMutation={() => handleDelete(row.original)} />
        </div>
      ),
    },
  ];
};
