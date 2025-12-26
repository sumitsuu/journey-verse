"use server";

import { z } from "zod";

import { updateUsers } from "../../services/user/update-user/update-user.service";
import type { User } from "../../types/user";

const updateUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().optional(),
  displayName: z.string().min(3, "Display name must be at least 3 characters long").optional(),
  avatarPath: z.string().nullable().optional(),
  favouredTypeId: z.number().int().positive().nullable().optional(),
  oldPassword: z.string().min(3, "Password must be at least 3 characters long").optional(),
  newPassword: z.string().min(3, "Password must be at least 3 characters long").optional(),
});

export async function updateUserAction(data: z.infer<typeof updateUserSchema>): Promise<User> {
  try {
    const validated = updateUserSchema.parse(data);

    return await updateUsers({
      id: data.id,
      email: validated.email,
      displayName: validated.displayName,
      avatarPath: validated.avatarPath ?? null,
      favouredTypeId: validated.favouredTypeId ?? null,
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update user");
  }
}
