import { navigateTo } from "#app";
import type { User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSupabase } from "~/shared/api/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const supabase = useSupabase();
  const isAuthenticated = computed(() => !!user.value);
  const isInitialized = ref(false);

  async function init() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    isInitialized.value = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function register(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await navigateTo("/login");
  }

  return { user, isAuthenticated, init, login, isInitialized, register, logout };
});
