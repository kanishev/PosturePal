import { mockNuxtImport, mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileForm from "./ProfileForm.vue";

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

mockNuxtImport("useSupabaseUser", () => () => ref({ id: "user-123" }));

vi.mock("vue-sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const mockProfile = {
  full_name: "John Doe",
  username: "johndoe",
  weight: 80,
  height: 180,
  date_of_birth: "1990-01-01",
  avatar_url: null,
  gender: "male" as const,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", async () => {
    const wrapper = await mountSuspended(ProfileForm);
    expect(wrapper.find("#fullName").exists()).toBe(true);
    expect(wrapper.find("#username").exists()).toBe(true);
    expect(wrapper.find("#weight").exists()).toBe(true);
    expect(wrapper.find("#height").exists()).toBe(true);
    expect(wrapper.find("#dateOfBirth").exists()).toBe(true);
    expect(wrapper.find("#avatarUrl").exists()).toBe(true);
  });

  it("fills form with profile prop data", async () => {
    const wrapper = await mountSuspended(ProfileForm, {
      props: { profile: mockProfile },
    });
    await flushPromises();

    await vi.waitFor(() => {
      const input = wrapper.find("#fullName").element as HTMLInputElement;
      expect(input.value).toBe("John Doe");
    });
  });

  it("calls updateProfile and shows success toast", async () => {
    registerEndpoint("/api/profile", {
      method: "PATCH",
      handler: () => ({ ...mockProfile, full_name: "Jane Doe" }),
    });

    const wrapper = await mountSuspended(ProfileForm, {
      props: { profile: mockProfile },
    });
    await flushPromises();

    await wrapper.find("#fullName").setValue("Jane Doe");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalled();
    });
  });

  it("shows error toast when update fails", async () => {
    registerEndpoint("/api/profile", {
      method: "PATCH",
      handler: () => {
        throw createError({ statusCode: 500, message: "Update failed" });
      },
    });

    const wrapper = await mountSuspended(ProfileForm, {
      props: { profile: mockProfile },
    });
    await flushPromises();

    await wrapper.find("#fullName").setValue("Jane Doe");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalled();
    });
  });
});
