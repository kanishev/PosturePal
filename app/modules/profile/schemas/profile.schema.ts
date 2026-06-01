import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(1, "Enter your name").nullable(),
  username: z.string().min(3, "Minimum 3 characters").nullable(),
  weight: z.number().min(1).max(500).nullable(),
  height: z.number().min(1).max(300).nullable(),
  date_of_birth: z.string().nullable(),
  gender: z.enum(["male", "female", "other"]).nullable(),
  avatar_url: z.string().url().nullable(),
});

export type Profile = z.infer<typeof profileSchema>;
