import { ColumnDef } from "@tanstack/react-table";
import { Assistant } from "@/lib/types/AssistantTable";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { DeleteAlert } from "@/app/dashboard/components/DeleteAlert";
import { DEFAULT_IMAGE } from "@/utils/utils";

export const columns = (
  handleEdit: (assistant: Assistant) => void,
  handleDelete: (id: string) => void,
): ColumnDef<Assistant>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "avatar_url",
      header: "Avatar",
      cell: ({ row }) => (
        <Image
          className="rounded-full"
          src={row.original.avatar_url || DEFAULT_IMAGE}
          width={40}
          height={40}
          alt={`${row.original.first_name} ${row.original.paternal_last_name}`}
        />
      ),
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
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
      header: "Fecha Nacimiento",
      cell: ({ row }) => new Date(row.original.birth_date).toLocaleDateString(),
    },
    {
      accessorKey: "dni",
      header: "DNI",
    },
    {
      accessorKey: "phone",
      header: "Celular",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Pencil className="size-4" />
          </Button>
          <DeleteAlert onDeleteMutation={() => handleDelete(row.original.id)} />
        </div>
      ),
    },
  ];
};
