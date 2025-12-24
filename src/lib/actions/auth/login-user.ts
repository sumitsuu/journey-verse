"use server";

import { z } from "zod";

import { loginUsers } from "../../services/auth/login-user";
import type { User } from "../../types/user";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginUserAction(
  data: z.infer<typeof loginUserSchema>
): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    const validated = loginUserSchema.parse(data);
    const result = await loginUsers(validated);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }
}
