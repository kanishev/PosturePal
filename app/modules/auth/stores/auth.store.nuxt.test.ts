import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./auth.store";

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();

mockNuxtImport("useSupabaseClient", () => () => ({
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    signOut: mockSignOut,
  },
}));

mockNuxtImport("useSupabaseUser", () => () => ref(null));

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("isAuthenticated", () => {
    it("returns false when user is null", () => {
      const store = useAuthStore();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("calls signInWithPassword with correct credentials", async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });
      const store = useAuthStore();

      await store.login("test@gmail.com", "123456");

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "123456",
      });
    });

    it("throws error when login fails", async () => {
      mockSignInWithPassword.mockResolvedValue({ error: new Error("Invalid credentials") });
      const store = useAuthStore();

      await expect(store.login("test@gmail.com", "wrong")).rejects.toThrow("Invalid credentials");
    });
  });

  describe("register", () => {
    it("calls signUp with correct credentials", async () => {
      mockSignUp.mockResolvedValue({ error: null });
      const store = useAuthStore();

      await store.register("test@gmail.com", "123456");

      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "123456",
      });
    });

    it("throws error when register fails", async () => {
      mockSignUp.mockResolvedValue({ error: new Error("Email already exists") });
      const store = useAuthStore();

      await expect(store.register("test@gmail.com", "123456")).rejects.toThrow("Email already exists");
    });
  });

  describe("logout", () => {
    it("calls signOut", async () => {
      mockSignOut.mockResolvedValue({ error: null });
      const store = useAuthStore();

      await store.logout();

      expect(mockSignOut).toHaveBeenCalled();
    });

    it("throws error when logout fails", async () => {
      mockSignOut.mockResolvedValue({ error: new Error("Logout failed") });
      const store = useAuthStore();

      await expect(store.logout()).rejects.toThrow("Logout failed");
    });
  });
});
