export const useAuthStore = defineStore("auth", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const isAuthenticated = computed(() => !!user.value);

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

  return { user, isAuthenticated, login, register, logout };
});
