"use server";

import { z } from "zod";

import { createUsers } from "../../services/user/create-user";
import type { User } from "../../types";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
});

export async function createUserAction(
  data: z.infer<typeof createUserSchema>
): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    const validated = createUserSchema.parse(data);
    const result = await createUsers(validated);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}
