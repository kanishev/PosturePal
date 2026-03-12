import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/modules/auth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.init();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
