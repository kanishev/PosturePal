<template>
  <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
import { useAuthStore } from "./modules/auth/stores/auth.store";

const authStore = useAuthStore();
await authStore.init();
</script>
