<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="text-muted-foreground text-sm">Loading...</span>
    </div>

    <div v-else-if="error" class="text-destructive text-sm py-4">
      {{ error }}
    </div>

    <div v-else-if="exercises?.length === 0" class="text-muted-foreground text-sm py-4">
      No exercises found
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <exercise-card
        v-for="exercise in exercises"
        :key="`${exercise.id}-${locale}`"
        :exercise="exercise"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableRow } from "~/shared/types/supabase";
import ExerciseCard from "./ExerciseCard.vue";

type Exercise = TableRow<"exercises">;

defineProps <{
  isLoading: boolean
  exercises: Exercise[] | undefined
  error: Error | undefined
}>();

const { locale } = useI18n();
</script>
