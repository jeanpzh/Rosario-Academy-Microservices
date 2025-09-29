"use client";
import Header from "@/app/dashboard/components/Header";
import CustomTable from "@/app/dashboard/components/CustomTable";
import { athleteColumns } from "@/lib/columns/athlete-columns";
import { levelColors, statusColors } from "@/utils/table";
import { Athlete } from "@/lib/types/AthleteTable";
import { useFetchAthletesQuery } from "@/hooks/use-fetch-athletes";
import { useDeleteAthleteQuery } from "@/hooks/use-delete-athlete";
import { useUpdateAthleteStatus } from "@/hooks/use-update-athlete-status";
import { useUpdateAthleteLevel } from "@/hooks/use-update-athlete-level";
import AddAthlete from "../admin/athlete-control/components/add-athlete";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useAthleteModalStore } from "@/lib/stores/useAthleteStore";

export default function AthleteControl() {
  const { setCurrentItem } = useAthleteModalStore();
  const { setOpenModal } = useModalStore();
  // Fetch athletes data
  const { data: athletes = [], isLoading } = useFetchAthletesQuery();

  // Delete and update mutations
  const deleteMutation = useDeleteAthleteQuery();
  const updateAthleteStatusMutation = useUpdateAthleteStatus();
  const updateAthleteLevelMutation = useUpdateAthleteLevel();

  // Handle edit action for athletes (actualiza el estado del modal y el atleta en edición)
  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date).toISOString().split("T")[0];
    setCurrentItem(athlete);
    setOpenModal("EDIT_ATHLETE");
  };

  // Handle delete action
  const handleDelete = (athlete: Athlete) => {
    deleteMutation.mutate(athlete.id);
  };

  return (
    <div className="dark:bg-dark-surface flex flex-col gap-4 bg-background p-4">
      <Header title="Control de Deportistas" />
      <AddAthlete />
      <CustomTable
        columns={athleteColumns(
          handleEdit,
          handleDelete,
          updateAthleteLevelMutation,
          updateAthleteStatusMutation,
          levelColors,
          statusColors,
        )}
        data={athletes}
        isLoading={isLoading}
      />
    </div>
  );
}
