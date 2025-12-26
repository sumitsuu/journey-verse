"use server";

import { z } from "zod";

import { registerUsers } from "../../services/auth/register-user.service";
import type { User } from "../../types/user";

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
});

export async function registerUserAction(
  data: z.infer<typeof registerUserSchema>
): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    const validated = registerUserSchema.parse(data);
    const result = await registerUsers(validated);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register user",
    };
  }
}
