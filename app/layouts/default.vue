<template>
  <div class="relative mx-auto min-h-dvh max-w-[430px] bg-background">
    <div class="fixed top-4 right-4 flex gap-2">
      <button class="text-white" @click="setLocale('en')">
        EN
      </button>
      <button class="text-white" @click="setLocale('ru')">
        RU
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 pb-12.5">
      <slot />
    </div>

    <navigation-bar />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useI18nData } from "~/common/composables/useI18nData";
import { useProfileStore } from "~/modules/profile";
import NavigationBar from "./components/NavigationBar.vue";

const { setLocale } = useI18n();
const { fetchProfile } = useProfileStore();

onMounted(() => {
  fetchProfile();
});

useI18nData();
</script>
