import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.from("exercises").select();

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }

  return data;
});
