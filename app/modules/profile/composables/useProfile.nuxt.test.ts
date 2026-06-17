import { mockNuxtImport, registerEndpoint } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useProfile } from "./useProfile";

const mockUser = ref<{ id: string } | null>({ id: "user-123" });

mockNuxtImport("useSupabaseUser", () => () => mockUser);

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.value = { id: "user-123" };
  });

  describe("fetchProfile", () => {
    it("does not fetch when user is not authenticated", async () => {
      mockUser.value = null;

      registerEndpoint("/api/profile", () => {
        throw new Error("should not be called");
      });

      const { fetchProfile, profile } = useProfile();
      await fetchProfile();

      expect(profile.value).toBeUndefined();
    });

    it("fetches profile successfully", async () => {
      registerEndpoint("/api/profile", () => ({
        id: "user-123",
        full_name: "John Doe",
        username: "johndoe",
        weight: 80,
        height: 180,
        date_of_birth: "1990-01-01",
        gender: "male",
        avatar_url: null,
      }));

      const { fetchProfile, profile, error, isLoading } = useProfile();
      await fetchProfile();

      expect(profile.value?.full_name).toBe("John Doe");
      expect(error.value).toBeNull();
      expect(isLoading.value).toBe(false);
    });
  });

  describe("updateProfile", () => {
    it("updates profile successfully", async () => {
      registerEndpoint("/api/profile", {
        method: "PATCH",
        handler: () => ({
          id: "user-123",
          full_name: "Jane Doe",
        }),
      });

      const { updateProfile, error } = useProfile();
      await updateProfile({ full_name: "Jane Doe" });

      expect(error.value).toBeNull();
    });

    it("throws error when update fails", async () => {
      registerEndpoint("/api/profile", {
        method: "PATCH",
        handler: () => {
          throw createError({ statusCode: 500, message: "Update failed" });
        },
      });

      const { updateProfile } = useProfile();

      await expect(updateProfile({ full_name: "Jane Doe" })).rejects.toThrow();
    });
  });
});
