import { mockNuxtImport, registerEndpoint } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useProfileStore } from "./profile.store";

const mockUser = ref<{ id: string } | null>({ id: "user-123" });
mockNuxtImport("useSupabaseUser", () => () => mockUser);

describe("useProfileStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockUser.value = { id: "user-123" };
  });

  describe("fetchProfile", () => {
    it("does not fetch when user is not authenticated", async () => {
      mockUser.value = null;

      const store = useProfileStore();
      await store.fetchProfile();

      expect(store.profile).toBeNull();
    });

    it("fetches profile successfully", async () => {
      registerEndpoint("/api/profile", () => ({
        full_name: "John Doe",
        username: "johndoe",
        weight: 80,
        height: 180,
        date_of_birth: "1990-01-01",
        gender: "male",
        avatar_url: null,
      }));

      const store = useProfileStore();
      await store.fetchProfile();

      expect(store.profile?.full_name).toBe("John Doe");
      expect(store.error).toBeNull();
      expect(store.isLoading).toBe(false);
    });
  });

  describe("updateProfile", () => {
    it("updates profile successfully", async () => {
      registerEndpoint("/api/profile", {
        method: "PATCH",
        handler: () => ({
          full_name: "Jane Doe",
        }),
      });

      const store = useProfileStore();
      await store.updateProfile({ full_name: "Jane Doe" });

      expect(store.error).toBeNull();
      expect(store.profile?.full_name).toBe("Jane Doe");
    });

    it("throws error when update fails", async () => {
      registerEndpoint("/api/profile", {
        method: "PATCH",
        handler: () => {
          throw createError({ statusCode: 500, message: "Update failed" });
        },
      });

      const store = useProfileStore();

      await expect(store.updateProfile({ full_name: "Jane Doe" })).rejects.toThrow();
    });
  });
});
