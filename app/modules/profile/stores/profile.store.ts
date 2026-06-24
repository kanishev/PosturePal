import { useSupabaseUser } from "#imports";
import { defineStore } from "pinia";
import { ref } from "vue";
import { handleError } from "~/shared/lib/handle-error";
import type { Profile } from "../schemas/profile.schema";

export const useProfileStore = defineStore("profile", () => {
  const user = useSupabaseUser();
  const profile = ref<Profile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProfile() {
    if (!user.value) return;
    try {
      isLoading.value = true;
      error.value = null;
      profile.value = await $fetch<Profile>("/api/profile");
    }
    catch (e: unknown) {
      error.value = handleError(e, "Failed to fetch profile");
    }
    finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!user.value) return;
    try {
      isLoading.value = true;
      error.value = null;
      profile.value = await $fetch<Profile>("/api/profile", {
        method: "PATCH",
        body: data,
      });
    }
    catch (e: unknown) {
      error.value = handleError(e, "Failed to update profile");
      throw e;
    }
    finally {
      isLoading.value = false;
    }
  }

  function clearProfile() {
    profile.value = null;
  }

  return { profile, isLoading, error, fetchProfile, updateProfile, clearProfile };
});
