import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { profileSchema } from "~/modules/profile/schemas/profile.schema";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);

  const result = profileSchema.partial().safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message ?? "Invalid data",
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", user.sub)
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
