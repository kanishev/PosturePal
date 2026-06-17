import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterForm from "./RegisterForm.vue";

const mockSignUp = vi.fn();

mockNuxtImport("useSupabaseClient", () => () => ({
  auth: {
    signUp: mockSignUp,
  },
}));

describe("RegidterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", async () => {
    const wrapper = await mountSuspended(RegisterForm);
    expect(wrapper.find("#email").exists()).toBe(true);
    expect(wrapper.find("#password").exists()).toBe(true);
    expect(wrapper.find("#confirmPassword").exists()).toBe(true);
  });

  it("shows validation errors for invalid input", async () => {
    const wrapper = await mountSuspended(RegisterForm);
    await wrapper.find("#email").setValue("not-an-email");
    await wrapper.find("#password").setValue("123");
    await wrapper.find("#confirmPassword").setValue("1234");
    await wrapper.find("form").trigger("submit");

    await flushPromises();

    await vi.waitFor(() => {
      const text = wrapper.text();
      expect(text).toContain("Invalid email");
      expect(text).toContain("Minimum 6 characters");
      expect(text).toContain("Passwords do not match");
    });
  });

  it("calls signInWithPassword with correct credentials", async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const wrapper = await mountSuspended(RegisterForm);

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("123456");
    await wrapper.find("form").trigger("submit");

    await flushPromises();

    await vi.waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "123456",
      });
    });
  });

  it("shows error message when signUp fails", async () => {
    mockSignUp.mockResolvedValue({ error: new Error("Invalid credentials") });
    const wrapper = await mountSuspended(RegisterForm);

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("123456");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Invalid credentials");
    });
  });
});
