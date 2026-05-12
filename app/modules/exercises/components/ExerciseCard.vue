<template>
  <Card class="cursor-pointer hover:shadow-xl transition-all overflow-hidden group relative h-full">
    <div
      class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      :style="{ backgroundImage: `url(${exercise.image_url})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
    </div>

    <div class="relative h-full flex flex-col p-5 z-10">
      <div class="flex flex-wrap gap-1 mb-3">
        <badge
          v-for="area in exercise.target_areas"
          :key="area"
          variant="secondary"
          class="text-xs bg-white/90 text-black hover:bg-white"
        >
          {{ area }}
        </badge>
      </div>

      <div class="mt-auto">
        <h3 class="text-white font-semibold text-xl leading-tight mb-2 drop-shadow-md">
          {{ exercise.name }}
        </h3>

        <p class="text-white/90 text-sm line-clamp-2 mb-3 drop-shadow-sm">
          {{ exercise.description }}
        </p>

        <div class="flex items-center justify-between text-xs text-white/80">
          <span>{{ durationLabel }}</span>
          <span class="capitalize px-2 py-0.5 rounded-full bg-white/20">
            {{ difficultyVariant }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Badge } from "~/shared/components/ui/badge";
import { Card } from "~/shared/components/ui/card";
import type { TableRow } from "~/shared/types/supabase";

type Exercise = TableRow<"exercises">;

const props = defineProps<{
  exercise: Exercise
}>();

const durationLabel = computed(() => {
  if (!props.exercise.duration_seconds) return "—";

  const mins = Math.floor(props.exercise.duration_seconds / 60);
  const secs = props.exercise.duration_seconds % 60;

  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;

  return `${mins}m ${secs}s`;
});

const difficultyVariant = computed(() => {
  if (!props.exercise.difficulty) return "default" as const;

  const map: Record<string, "default" | "secondary" | "destructive"> = {
    beginner: "default",
    intermediate: "secondary",
    advanced: "destructive",
  };

  return map[props.exercise.difficulty] ?? "default";
});
</script>
