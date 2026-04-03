<template>
  <div class="min-h-screen bg-background">
    <div class="fixed top-4 right-4 flex gap-2">
      <button class="text-white" @click="setLocale('en')">
        EN
      </button>
      <button class="text-white" @click="setLocale('ru')">
        RU
      </button>
    </div>
    SIDEBAR
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden lg:ml-64">
      <!-- Topbar -->
      <!-- <Topbar /> -->
      TOPBAR
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { setLocale } = useI18n();
</script>
