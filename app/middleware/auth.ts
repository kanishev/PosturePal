import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/modules/auth";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
