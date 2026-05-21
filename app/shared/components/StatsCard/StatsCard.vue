<template>
  <div class="relative mx-4 mb-4 mt-2 rounded-2xl bg-black/60 p-4 backdrop-blur-sm">
    <div class="flex items-center justify-between">
      <div class="flex-1 text-center">
        <p class="text-xs text-white/60">
          {{ t('common.weight') }}
        </p>
        <p class="mt-1 text-white">
          <span class="text-2xl font-bold">{{ stats.weight }}</span>
          <span class="ml-1 text-sm text-white/60">Kg</span>
        </p>
      </div>
      <div class="h-10 w-px bg-white/20" />
      <div class="flex-1 text-center">
        <p class="text-xs text-white/60">
          {{ t('common.height') }}
        </p>
        <p class="mt-1 text-white">
          <span class="text-2xl font-bold">{{ stats.height }}</span>
          <span class="ml-1 text-sm text-white/60">Cm</span>
        </p>
      </div>
      <div class="h-10 w-px bg-white/20" />
      <div class="flex-1 text-center">
        <p class="text-xs text-white/60">
          {{ t('common.todoToday') }}
        </p>
        <p class="mt-1 text-white">
          <span class="text-2xl font-bold">{{ stats.todoToday }}</span>
          <span class="ml-1 text-sm text-white/60">%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

withDefaults(defineProps<{
  stats?: {
    weight: number
    height: number
    todoToday: number
  }
}>(), {
  stats: () => ({
    weight: 0,
    height: 0,
    todoToday: 0,
  }),
});

const { t } = useI18n();
</script>
