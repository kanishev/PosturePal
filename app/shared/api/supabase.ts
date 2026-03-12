import { useRuntimeConfig } from "#app";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase/database.types";

let client: SupabaseClient<Database> | null = null;

export const useSupabase = () => {
  if (!client) {
    const config = useRuntimeConfig();

    client = createClient<Database>(
      config.public.supabaseUrl,
      config.public.supabasePublishableKey,
    );
  }

  return client;
};
