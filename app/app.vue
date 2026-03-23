<template>
  <div class="root flex min-h-screen items-center justify-center bg-zinc-950 dark:bg-white">
    <Toaster />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "~/shared/components/ui/sonner";
</script>
