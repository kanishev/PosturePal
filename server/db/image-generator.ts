import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import sharp from "sharp";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  global: {
    headers: { "x-client-info": "storage-upload-script" },
  },
});

const bucketName = "exercise-images";

const sizes = {
  thumbnail: { width: 150, height: 150, quality: 70 },
  card: { width: 400, height: 300, quality: 80 },
  full: { width: 1200, height: 800, quality: 90 },
} as const;

type ImageSize = keyof typeof sizes;

const exercises = [
  { slug: "neck-tilt", filePath: "./images/neck-tilt.webp" },
  { slug: "neck-rotation", filePath: "./images/neck-rotation.webp" },
  { slug: "chin-tuck", filePath: "./images/chin-tuck.webp" },
  { slug: "shoulder-rolls", filePath: "./images/shoulder-rolls.webp" },
  { slug: "cat-cow-stretch", filePath: "./images/cat-cow-stretch.webp" },
  { slug: "childs-pose", filePath: "./images/childs-pose.webp" },
  { slug: "cobra-stretch", filePath: "./images/cobra-stretch.webp" },
  { slug: "seated-forward-bend", filePath: "./images/seated-forward-bend.webp" },
];

type UploadResult = {
  slug: string
  success: boolean
  error?: string
  skipped?: boolean
};

function validateFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / 1024 / 1024;

  if (fileSizeMB > 50) {
    throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB (max 50MB)`);
  }
}

async function processImage(filePath: string, size: ImageSize): Promise<Buffer> {
  const { width, height, quality } = sizes[size];
  try {
    return await sharp(filePath)
      .resize(width, height, { fit: "cover" })
      .webp({ quality })
      .toBuffer();
  }
  catch (err) {
    throw new Error(`Failed to process image for size ${size}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function uploadToStorage(buffer: Buffer, path: string, retries = 3): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, buffer, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "3600",
      });

    if (!error) return;

    console.warn(`  Attempt ${attempt}/${retries} failed for ${path}: ${error.message}`);

    if (attempt === retries) {
      throw new Error(`Upload failed after ${retries} attempts: ${error.message}`);
    }

    await new Promise(r => setTimeout(r, 1500 * attempt));
  }
}

async function updateDatabase(slug: string): Promise<void> {
  const imagePath = `exercises/${slug}/card.webp`;
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${imagePath}`;

  const { error } = await supabase
    .from("exercises")
    .update({ image_path: imagePath, image_url: imageUrl })
    .eq("slug", slug);

  if (error) {
    throw new Error(`Failed to update database: ${error.message}`);
  }
}

async function processExercise(slug: string, filePath: string): Promise<UploadResult> {
  console.log(`\nProcessing: ${slug}`);

  try {
    validateFile(filePath);
  }
  catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Skipped: ${message}`);
    return { slug, success: false, skipped: true, error: message };
  }

  const fileSizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
  console.log(`File size: ${fileSizeMB}MB`);

  for (const size of Object.keys(sizes) as ImageSize[]) {
    try {
      console.log(`Processing size: ${size}`);
      const buffer = await processImage(filePath, size);
      const storagePath = `exercises/${slug}/${size}.webp`;
      await uploadToStorage(buffer, storagePath);
      console.log(`Uploaded ${size}`);
    }
    catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Failed ${size}: ${message}`);
      return { slug, success: false, error: message };
    }
  }

  try {
    await updateDatabase(slug);
    console.log("Database updated");
  }
  catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Database update failed: ${message}`);
    return { slug, success: false, error: message };
  }

  return { slug, success: true };
}

async function uploadAll() {
  console.log("Starting upload...\n");
  console.log(`Exercises to process: ${exercises.length}`);

  const results: UploadResult[] = [];

  for (const { slug, filePath } of exercises) {
    const result = await processExercise(slug, filePath);
    results.push(result);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log("\n=== Results ===");
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success && !r.skipped);
  const skipped = results.filter(r => r.skipped);

  console.log(`Success: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Skipped: ${skipped.length}`);

  if (failed.length > 0) {
    console.log("\nFailed exercises:");
    failed.forEach(r => console.log(`  - ${r.slug}: ${r.error}`));
  }

  if (skipped.length > 0) {
    console.log("\nSkipped exercises:");
    skipped.forEach(r => console.log(`  - ${r.slug}: ${r.error}`));
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

uploadAll().catch((err) => {
  console.error("Unexpected error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
