<template>
  <main>
    <div class="absolute inset-0">
      <img
        src="../assets/images/hero-bg.webp"
        alt="workout"
        class="h-full w-full object-cover opacity-90"
      >
    </div>
    <div class="relative w-full" style="min-height: 280px;">
      <div class="relative flex items-center justify-between p-4">
        <div class="h-12 w-12 overflow-hidden rounded-full border-2 bg-white border-white/20">
          <!-- <img src="/" alt="avatar" class="h-full w-full object-cover" > -->
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/notifications" class="relative rounded-full bg-white/20 p-2 backdrop-blur-sm cursor-pointer">
            <message-circle class="h-5 w-5 text-white" />
          </NuxtLink>

          <NuxtLink to="/comments" class="relative rounded-full bg-white/20 p-2 backdrop-blur-sm cursor-pointer">
            <bell class="h-5 w-5 text-white" />
            <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400" />
          </NuxtLink>
        </div>
      </div>

      <div class="relative px-4 pb-4 pt-2">
        <p class="text-3xl text-white/80">
          {{ t('dashboard.greeting', { name: user?.email }) }}
        </p>
        <h2 class="mt-1 text-4xl font-medium leading-tight text-white">
          {{ t('dashboard.question') }}
        </h2>
      </div>

      <stats-card :stats />
    </div>

    <div class="relative flex flex-col gap-6 px-4 py-6 bg-white rounded-3xl">
      <div class="relative rounded-2xl bg-blue-50 p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 pr-4">
            <h2 class="text-xl font-bold leading-tight text-gray-900">
              {{ t('dashboard.hero.title') }}
            </h2>
            <button class="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
              {{ t('dashboard.hero.cta') }}
            </button>
          </div>
          <img
            src="../assets/images/thumb-1.png"
            alt="hero"
            class="absolute right-0 w-[145px] h-[160px] bottom-0 object-cover"
          >
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-2">
          {{ t('dashboard.category') }}
        </h3>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div
            v-for="cat in categories"
            :key="cat.label"
            class="flex flex-shrink-0 flex-col items-center gap-1"
          >
            <div class="relative h-20 w-20 overflow-hidden rounded-2xl bg-gray-200">
              <img
                :src="cat.image"
                :alt="cat.label"
                class="h-full w-full object-cover"
              >
              <div class="absolute inset-0 bg-black/30" />
              <span class="absolute bottom-1 left-0 right-0 text-center text-xs font-medium text-white">
                {{ cat.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-lg font-bold">
            {{ t('dashboard.popularWorkout') }}
          </h3>
          <NuxtLink to="/about" class="font-medium text-amber-300">
            {{ t('dashboard.seeAll') }}
          </NuxtLink>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div
            v-for="workout in workouts"
            :key="workout.title"
            class="flex w-44 flex-shrink-0 flex-col gap-2"
          >
            <div class="relative h-48 overflow-hidden rounded-2xl bg-gray-200">
              <!-- <img :src="workout.image" :alt="workout.title" class="h-full w-full object-cover"> -->
              <div class="absolute left-2 top-2 flex gap-1">
                <span
                  v-for="tag in workout.tags"
                  :key="tag"
                  class="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-800"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-foreground">
                {{ workout.title }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ workout.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Bell, MessageCircle } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/modules/auth";
import StatsCard from "~/shared/components/StatsCard/StatsCard.vue";
import { getStorageUrl } from "~/shared/lib/image";

const { t } = useI18n();

definePageMeta({
  layout: "default",
});

const { user } = useAuthStore();

const stats = ref<{
  weight: number
  height: number
  todoToday: number
}>({
  weight: 100,
  height: 100,
  todoToday: 100,
});

const categories = computed(() => [
  { label: t("dashboard.categories.neck"), image: getStorageUrl("common", "neck.png") },
  { label: t("dashboard.categories.back"), image: getStorageUrl("common", "back.png") },
]);

const workouts = [
  { title: "Up and Down Stairs", description: "Train your thighs and legs", image: "", tags: ["Thighs", "Legs"] },
  { title: "Lifting Belly", description: "Shape the stomach to loo...", image: "", tags: ["Stomach", "Hand"] },
];
</script>
