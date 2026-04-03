import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: _routes => [
    {
      name: "home",
      path: "/",
      component: () => import("~/pages/home.vue"),
      meta: { layout: "default" },
    },
    {
      name: "login",
      path: "/login",
      component: () => import("~/pages/login.vue"),
      meta: { layout: "auth" },
    },
    {
      name: "register",
      path: "/register",
      component: () => import("~/pages/register.vue"),
      meta: { layout: "auth" },
    },
  ],
} satisfies RouterConfig;
