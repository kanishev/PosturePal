import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm.vue";

const mockSignInWithPassword = vi.fn();
const mockNavigateTo = vi.fn();

mockNuxtImport("useSupabaseClient", () => () => ({
  auth: {
    signInWithPassword: mockSignInWithPassword,
  },
}));

mockNuxtImport("navigateTo", () => (...args: unknown[]) => mockNavigateTo(...args));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", async () => {
    const wrapper = await mountSuspended(LoginForm);
    expect(wrapper.find("#email").exists()).toBe(true);
    expect(wrapper.find("#password").exists()).toBe(true);
  });

  it("shows validation errors for invalid input", async () => {
    const wrapper = await mountSuspended(LoginForm);
    await wrapper.find("#email").setValue("not-an-email");
    await wrapper.find("#password").setValue("123");
    await wrapper.find("form").trigger("submit");

    await flushPromises();

    await vi.waitFor(() => {
      const text = wrapper.text();
      expect(text).toContain("Некорректный email");
      expect(text).toContain("Минимум 6 символов");
    });
  });

  it("calls signInWithPassword with correct credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const wrapper = await mountSuspended(LoginForm);

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("form").trigger("submit");

    await flushPromises();

    await vi.waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "123456",
      });
    });
  });

  it("shows error message when login fails", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: new Error("Invalid credentials") });
    const wrapper = await mountSuspended(LoginForm);

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Invalid credentials");
    });
  });

  it("disables the submit button while logging in", async () => {
    let resolvePromise!: (value: { error: null }) => void;

    mockSignInWithPassword.mockReturnValue(new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    const wrapper = await mountSuspended(LoginForm);
    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() => {
      expect(wrapper.find("[data-testid='submit-button']").attributes()).toHaveProperty("disabled");
    });

    resolvePromise({ error: null });
  });

  it("navigates to register page on Sign Up click", async () => {
    const wrapper = await mountSuspended(LoginForm);
    await wrapper.find("[data-testid='sign-up-button']").trigger("click");
    expect(mockNavigateTo).toHaveBeenCalledWith("/register");
  });
});
