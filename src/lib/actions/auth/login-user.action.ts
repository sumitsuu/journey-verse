"use server";

import { z } from "zod";

import { loginUsers } from "../../services/auth/login-user.service";
import type { User } from "../../types/user";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginUserAction(data: z.infer<typeof loginUserSchema>): Promise<User> {
  try {
    const validated = loginUserSchema.parse(data);
    return await loginUsers(validated);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to login");
  }
}
