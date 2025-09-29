import { getAssistantsAction } from "@/app/dashboard/actions/assistantActions";
import { Assistant } from "@/lib/types/AssistantTable";
import { useQuery } from "@tanstack/react-query";

export function useAssistantQuery() {
  return useQuery<Assistant[]>({
    queryKey: ["assistants"],
    queryFn: getAssistantsAction,
    staleTime: 1000 * 60 * 5,
  });
}
