import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

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

async function uploadWithRetry(filePath: string, fileName: string, retries = 3) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);

  console.log(`Loading ${fileName} (${fileSizeMB} MB)`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await supabase.storage
        .from(bucketName)
        .upload(`exercises/${fileName}`, fileBuffer, {
          contentType: "image/webp",
          upsert: true,
          cacheControl: "3600",
        });

      if (result.error) throw result.error;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`exercises/${fileName}`);

      await supabase
        .from("exercises")
        .update({
          image_path: `exercises/${fileName}`,
          image_url: publicUrlData.publicUrl,
        })
        .eq("slug", fileName.replace(".webp", ""));

      console.log(`Success: ${fileName}`);
      return true;
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Attempt ${attempt}/${retries} failed for ${fileName}:`, err.message);
      }

      if (attempt === retries) {
        console.error(`Unable to upload ${fileName} after ${retries} attemtps`);
        return false;
      }

      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

async function uploadAll() {
  console.log("Uploading started...");

  for (const ex of exercises) {
    const fileName = `${ex.slug}.webp`;
    await uploadWithRetry(ex.filePath, fileName);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log("Uploading ended!");
}

uploadAll().catch(console.error);
