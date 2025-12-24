"use server";

import { z } from "zod";

import { createUsers } from "../../services/user/create-user";
import type { User } from "../../types/user";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
});

export type CreateUserActionOutputSuccess = {
  success: true;
  data: User;
};

export async function createUserAction(data: z.infer<typeof createUserSchema>): Promise<CreateUserActionOutputSuccess> {
  try {
    const validated = createUserSchema.parse(data);
    const result = await createUsers(validated);
    return { success: true, data: result };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create user");
  }
}
