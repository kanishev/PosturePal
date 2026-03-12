<template>
  <NuxtPage v-if="authStore.isInitialized" />
</template>

<script setup lang="ts">
import { useAuthStore } from "./modules/auth";

const authStore = useAuthStore();
</script>
