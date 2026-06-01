import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  if (!data) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  return data;
});
