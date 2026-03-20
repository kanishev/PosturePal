import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: _routes => [
    {
      name: "home",
      path: "/",
      component: () => import("~/pages/home.vue"),
    },
    {
      name: "login",
      path: "/login",
      component: () => import("~/pages/login.vue"),
    },
    {
      name: "register",
      path: "/register",
      component: () => import("~/pages/register.vue"),
    },
  ],
} satisfies RouterConfig;
