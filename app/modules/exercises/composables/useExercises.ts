import { useI18n } from "vue-i18n";
import type { TableRow } from "~/shared/types/supabase";

type Exercise = TableRow<"exercises">;

export function useExercises() {
  const { locale } = useI18n();

  const {
    data: exercises,
    pending: isLoading,
    error,
    refresh,
  } = useFetch<Exercise[]>("/api/exercises", {
    query: { locale },
    key: `exercises-list-${locale.value}`,

    transform: (data) => {
      return data || [];
    },
  });

  return {
    exercises,
    isLoading,
    error,
    fetchData: refresh,
  };
}
