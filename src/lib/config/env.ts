import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  MINIO_ENDPOINT: z.string().url().optional(),
  MINIO_ACCESS_KEY: z.string().min(1).optional(),
  MINIO_SECRET_KEY: z.string().min(1).optional(),
  MINIO_BUCKET_NAME: z.string().min(1).optional(),
  MINIO_REGION: z.string().min(1).optional(),
  MINIO_PUBLIC_URL: z.string().url().optional(),
});

// Only validate in server-side code
let parsedEnv: z.infer<typeof envSchema> | null = null;

if (typeof window === "undefined") {
  try {
    parsedEnv = envSchema.parse(process.env);
  } catch (error) {
    console.warn("Environment validation failed:", error);
  }
}

export type Env = z.infer<typeof envSchema>;

export const DATABASE_URL: string | undefined = parsedEnv?.DATABASE_URL ?? process.env.DATABASE_URL;
