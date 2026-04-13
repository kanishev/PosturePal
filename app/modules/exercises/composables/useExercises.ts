import { ref } from "vue";
import type { TableRow } from "~/shared/types/supabase";

type Exercise = TableRow<"exercises">;

export function useExercises() {
  const exercises = ref<Exercise[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchExercises() {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await $fetch<Exercise[]>("/api/exercises");
      exercises.value = data;
    }
    catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to fetch exercises";
    }
    finally {
      isLoading.value = false;
    }
  }

  return { exercises, isLoading, error, fetchExercises };
}
