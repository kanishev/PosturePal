<template>
  <main>
    <h1 class="text-[40px] text-center text-gray-500">
      Hello
    </h1>
    <Button>Click me</Button>

    <ul>
      <li v-for="instrument in instruments" :key="instrument.id">
        {{ instrument.name }}
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from "#app";
import { Button } from "@/shared/components/ui/button";
import { onMounted, ref } from "vue";

import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabasePublishableKey);
const instruments = ref([]);

async function getInstruments() {
  const { data } = await supabase.from("instruments").select();
  instruments.value = data;
}
onMounted(() => {
  getInstruments();
});

let a = "";
a = 1;
</script>
