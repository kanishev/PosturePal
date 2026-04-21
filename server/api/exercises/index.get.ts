import { serverSupabaseClient } from "#supabase/server";

type ExerciseTranslation = {
  name: string
  description: string | null
  instructions: string | null
  locale: string
};

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const query = getQuery(event);
  const locale = query.locale as string ?? "en";

  const { data, error } = await supabase
    .from("exercises")
    .select(`
      *,
      exercise_translations (
        name,
        description,
        instructions,
        locale
      )
    `)
    .eq("exercise_translations.locale", locale);

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }

  return data.map((exercise) => {
    const translations = exercise.exercise_translations as ExerciseTranslation[] | null;
    const translation = translations?.[0];
    return {
      ...exercise,
      name: translation?.name ?? exercise.name,
      description: translation?.description ?? exercise.description,
      instructions: translation?.instructions ?? exercise.instructions,
    };
  });
});
