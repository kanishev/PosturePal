import { useRuntimeConfig } from "#app";

type ImageSize = "thumbnail" | "card" | "full";

export function getExerciseImageUrl(slug: string | null, size: ImageSize = "card"): string {
  if (!slug) return "/images/placeholder.jpg";
  const supabaseUrl = useRuntimeConfig().public.supabase.url as string;
  return `${supabaseUrl}/storage/v1/object/public/exercise-images/${slug}/${size}.webp`;
}
