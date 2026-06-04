import { useSupabaseUser } from "#imports";
import type { Profile } from "../schemas/profile.schema";

export function useProfile() {
  const user = useSupabaseUser();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { data: profile, refresh } = useFetch<Profile>("/api/profile", {
    immediate: false,
  });

  async function fetchProfile() {
    if (!user.value) return;
    try {
      isLoading.value = true;
      error.value = null;
      await refresh();
    }
    catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to fetch profile";
    }
    finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!user.value) return;
    console.log("-aaa", data);
    try {
      isLoading.value = true;
      error.value = null;
      await $fetch("/api/profile", {
        method: "PATCH",
        body: data,
      });
      await refresh();
    }
    catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to update profile";
      throw e;
    }
    finally {
      isLoading.value = false;
    }
  }

  return { profile, isLoading, error, fetchProfile, updateProfile };
}
