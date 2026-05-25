import { useRuntimeConfig } from "#app";

const _IMAGE_SIZES = ["thumbnail", "card", "full"] as const;
type ImageSize = typeof _IMAGE_SIZES[number];

const BUCKETS = {
  exercises: "exercise-images",
  common: "common-images",
} as const;

type Bucket = keyof typeof BUCKETS;

function getSupabaseUrl(): string {
  return useRuntimeConfig().public.supabase.url as string;
}

export function getStorageUrl(bucket: Bucket, path: string | null): string {
  if (!path) return "/images/placeholder.jpg";
  return `${getSupabaseUrl()}/storage/v1/object/public/${BUCKETS[bucket]}/${path}`;
}

export function getExerciseImageUrl(slug: string | null, size: ImageSize = "card"): string {
  if (!slug) return "/images/placeholder.jpg";
  return getStorageUrl("exercises", `exercises/${slug}/${size}.webp`);
}
