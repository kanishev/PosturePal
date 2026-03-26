import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
  ],
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  compatibilityDate: "2025-07-15",
  vite: {
    plugins: [
      // @ts-expect-error — type conflict between rollup versions, works at runtime
      tailwindcss(),
    ],
  },
  typescript: {
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    locales: [
      { code: "en", name: "English" },
      { code: "ru", name: "Русский" },
    ],
    defaultLocale: "en",
    vueI18n: "@/configs/i18n.config.ts",
  },
  shadcn: {
    prefix: "",
    componentDir: "@/shared/components/ui",
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? "https://test.supabase.co",
    key: process.env.SUPABASE_PUBLISHABLE_KEY ?? "test-key",
    types: "@/shared/types/supabase/database.types.ts",
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/register"],
    },
  },
});
