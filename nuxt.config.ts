import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
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
        skipLibCheck: true,
        useUnknownInCatchVariables: true,
        noImplicitOverride: true,
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  fonts: {
    provider: "google",
    families: [
      { name: "Plus Jakarta Sans", provider: "google", weights: [400, 500, 600, 700] },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    vueI18n: "@/configs/i18n.config.ts",
    locales: [
      { code: "en", iso: "en-US" },
      { code: "ru", iso: "ru-RU" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
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
