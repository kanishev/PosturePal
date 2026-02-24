<template>
  <main>
    <h1 class="text-[40px] text-center text-gray-500">
      {{ website.name }}
    </h1>
    <p>{{ website.description }}</p>
    <Button>Click me</Button>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useTestStore } from "@/stores/test.ts";

const website = useTestStore();

await callOnce(website.fetch);
</script>
