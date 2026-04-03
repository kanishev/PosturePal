<template>
  <div class="bg-zinc-950 dark:bg-white">
    <Toaster />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "~/shared/components/ui/sonner";
</script>
