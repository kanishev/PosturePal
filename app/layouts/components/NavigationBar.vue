<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[72px]
           bg-background border-t border-border flex items-center justify-around
           px-2 z-50
    "
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <button
      v-for="tab in tabs"
      :key="tab.path"
      class="flex flex-col items-center gap-1 flex-1 pt-2 transition-transform active:scale-95"
      @click="navigate(tab.path)"
    >
      <component
        :is="tab.icon"
        class="w-[22px] h-[22px] transition-colors"
        :class="isActive(tab.path) ? 'text-orange-400' : 'text-muted-foreground'"
        :stroke-width="1.7"
      />
      <span
        class="text-[10px] font-medium transition-colors"
        :class="isActive(tab.path) ? 'text-orange-400' : 'text-muted-foreground'"
      >
        {{ tab.label }}
      </span>
    </button>
  </nav>
</template>

<script setup>
import { Home, Dumbbell, BarChart2, User } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/exercises", label: "Workout", icon: Dumbbell },
  { path: "/stats", label: "Statistics", icon: BarChart2 },
  { path: "/profile", label: "Profile", icon: User },
];

const currentPath = computed(() => route.path);

const isActive = (path) => {
  if (path === "/") return currentPath.value === "/";
  return currentPath.value.startsWith(path);
};

const navigate = path => router.push(path);
</script>
