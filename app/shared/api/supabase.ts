import { useRuntimeConfig } from "#app";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase/database.types";

const config = useRuntimeConfig();

export const supabase = createClient<Database>(
  config.public.supabaseUrl,
  config.public.supabasePublishableKey,
);
