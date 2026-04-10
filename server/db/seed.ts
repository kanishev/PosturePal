import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Database } from "../../app/shared/types/supabase/database.types";

dotenv.config();

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const exercises = [
  {
    name: "Neck tilt",
    slug: "neck-tilt",
    description: "Gentle side-to-side neck stretch to relieve tension.",
    instructions: "1. Sit straight.\n2. Slowly tilt head to the right.\n3. Hold 5 seconds.\n4. Repeat on left side.",
    duration_seconds: 30,
    difficulty: "beginner" as const,
    target_areas: ["neck"],
    video_url: null,
    image_url: null,
    tags: ["stretch", "neck", "beginner"],
    is_public: true,
  },
  {
    name: "Neck rotation",
    slug: "neck-rotation",
    description: "Full neck rotation to improve mobility and reduce stiffness.",
    instructions: "1. Sit upright.\n2. Slowly rotate head clockwise.\n3. Complete full circle.\n4. Repeat counterclockwise.",
    duration_seconds: 45,
    difficulty: "beginner" as const,
    target_areas: ["neck"],
    video_url: null,
    image_url: null,
    tags: ["mobility", "neck", "rotation"],
    is_public: true,
  },
  {
    name: "Chin tuck",
    slug: "chin-tuck",
    description: "Strengthens deep neck flexors and improves posture.",
    instructions: "1. Sit or stand tall.\n2. Pull chin straight back.\n3. Hold 5 seconds.\n4. Release slowly.",
    duration_seconds: 30,
    difficulty: "beginner" as const,
    target_areas: ["neck"],
    video_url: null,
    image_url: null,
    tags: ["posture", "neck", "strength"],
    is_public: true,
  },
  {
    name: "Shoulder rolls",
    slug: "shoulder-rolls",
    description: "Releases tension in shoulders and upper back.",
    instructions: "1. Sit straight.\n2. Roll shoulders forward 5 times.\n3. Roll backward 5 times.",
    duration_seconds: 30,
    difficulty: "beginner" as const,
    target_areas: ["neck", "upper back"],
    video_url: null,
    image_url: null,
    tags: ["stretch", "shoulders", "neck"],
    is_public: true,
  },
  {
    name: "Cat-cow stretch",
    slug: "cat-cow-stretch",
    description: "Classic yoga movement to mobilize the entire spine.",
    instructions: "1. Start on all fours.\n2. Inhale — arch back, lift head.\n3. Exhale — round back, tuck chin.\n4. Repeat slowly.",
    duration_seconds: 60,
    difficulty: "beginner" as const,
    target_areas: ["lower back", "upper back"],
    video_url: null,
    image_url: null,
    tags: ["yoga", "back", "mobility"],
    is_public: true,
  },
  {
    name: "Child's pose",
    slug: "childs-pose",
    description: "Deep lower back and hip stretch.",
    instructions: "1. Kneel on floor.\n2. Sit back on heels.\n3. Stretch arms forward on floor.\n4. Hold 30 seconds.",
    duration_seconds: 45,
    difficulty: "beginner" as const,
    target_areas: ["lower back", "hips"],
    video_url: null,
    image_url: null,
    tags: ["yoga", "back", "stretch"],
    is_public: true,
  },
  {
    name: "Cobra stretch",
    slug: "cobra-stretch",
    description: "Strengthens back muscles and opens the chest.",
    instructions: "1. Lie face down.\n2. Place hands under shoulders.\n3. Push up keeping hips on floor.\n4. Hold 10 seconds.",
    duration_seconds: 45,
    difficulty: "intermediate" as const,
    target_areas: ["lower back", "chest"],
    video_url: null,
    image_url: null,
    tags: ["yoga", "back", "strength"],
    is_public: true,
  },
  {
    name: "Seated forward bend",
    slug: "seated-forward-bend",
    description: "Stretches hamstrings and lower back.",
    instructions: "1. Sit with legs straight.\n2. Inhale and lengthen spine.\n3. Exhale and reach toward toes.\n4. Hold 20 seconds.",
    duration_seconds: 30,
    difficulty: "intermediate" as const,
    target_areas: ["lower back", "hamstrings"],
    video_url: null,
    image_url: null,
    tags: ["stretch", "back", "hamstrings"],
    is_public: true,
  },
];

async function seed() {
  console.log("Seeding exercises...");

  const { error } = await supabase
    .from("exercises")
    .upsert(exercises, { onConflict: "slug" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${exercises.length} exercises`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
