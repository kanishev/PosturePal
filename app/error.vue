<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <template v-if="error">
      <h1 class="text-4xl font-bold">
        {{ error.statusCode }}
      </h1>
      <p class="text-muted-foreground">
        {{ error.message }}
      </p>
    </template>
    <Button @click="handleError">
      На главную
    </Button>
  </div>
</template>

<script setup lang="ts">
import { clearError, useError } from "#app";
import { Button } from "~/shared/components/ui/button";

const error = useError();

async function handleError() {
  await clearError({ redirect: "/" });
}
</script>
