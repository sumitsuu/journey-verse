import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
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
