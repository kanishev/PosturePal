import { useI18n } from "vue-i18n";
import type { TableRow } from "~/shared/types/supabase";

type Exercise = TableRow<"exercises">;

type UseExercisesOptions = {
  search?: Ref<string>
};

export function useExercises(options?: UseExercisesOptions) {
  const { locale } = useI18n();

  const searchRef = options?.search ?? ref("");

  const {
    data: exercises,
    pending: isLoading,
    error,
    refresh,
  } = useFetch<Exercise[]>("/api/exercises", {
    query: {
      locale: locale,
      search: searchRef,
    },
    key: computed(() => `exercises-list-${locale.value}-${searchRef.value ? "search" : "all"}`),
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
