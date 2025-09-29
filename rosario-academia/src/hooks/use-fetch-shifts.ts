import { getShifts } from "@/app/(auth-pages)/actions";
import { useQuery } from "@tanstack/react-query";

export function useShiftQuery() {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: getShifts,
    staleTime: 1000 * 60 * 5,
  });
}
