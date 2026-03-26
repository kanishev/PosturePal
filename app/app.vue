<template>
  <div class="root flex min-h-screen items-center justify-center bg-zinc-950 dark:bg-white">
    <div class="fixed top-4 right-4 flex gap-2">
      <button class="text-white" @click="setLocale('en')">
        EN
      </button>
      <button class="text-white" @click="setLocale('ru')">
        RU
      </button>
    </div>
    <Toaster />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Toaster } from "~/shared/components/ui/sonner";

const { setLocale } = useI18n();
</script>
