"use server";

import { z } from "zod";

import { CreateUserOutput, createUsers } from "../../services/user/create-user.service";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
});

export async function createUserAction(data: z.infer<typeof createUserSchema>): Promise<CreateUserOutput> {
  try {
    const validated = createUserSchema.parse(data);
    return await createUsers(validated);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create user");
  }
}
