"use server";

import { z } from "zod";

import { registerUsers } from "../../services/auth/register-user.service";
import type { CreateUserOutput } from "../../services/user/create-user.service";

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
});

export async function registerUserAction(data: z.infer<typeof registerUserSchema>): Promise<CreateUserOutput> {
  try {
    const validated = registerUserSchema.parse(data);
    return await registerUsers(validated);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to register user");
  }
}
