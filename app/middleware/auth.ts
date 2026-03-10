import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/modules/auth";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
