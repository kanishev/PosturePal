<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold">
      All workout
    </h1>

    <input-group class="mb-3 mt-3 rounded-2xl">
      <input-group-input
        v-model="searchModel"
        placeholder="Search..."
      />
      <input-group-addon>
        <search />
      </input-group-addon>
      <input-group-addon align="inline-end">
        {{ exercises?.length }} results
      </input-group-addon>
    </input-group>

    <exercise-list
      :exercises="exercises"
      :is-loading="isLoading"
      :error="error"
    ></exercise-list>
  </div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { ExerciseList, useExercises } from "~/modules/exercises";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/shared/components/ui/input-group";

const searchModel = ref("");

const { exercises, isLoading, error } = useExercises({
  search: searchModel,
});
</script>
