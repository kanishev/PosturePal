<template>
  <main>
    <h1 class="text-[40px] text-center text-gray-500">
      Hello
    </h1>
    <Button @click="authStore.logout">
      Logout
    </Button>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "../modules/auth/stores/auth.store";

const authStore = useAuthStore();
</script>
