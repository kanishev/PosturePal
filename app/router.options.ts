import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: (_routes) => [
    {
      name: "home",
      path: "/",
      component: () => import("~/pages/home.vue"),
    },
    {
      name: "about",
      path: "/about",
      component: () => import("~/pages/about.vue"),
    },
  ],
} satisfies RouterConfig;
