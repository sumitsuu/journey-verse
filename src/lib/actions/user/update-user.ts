"use server";

import { z } from "zod";

import { findUsersById } from "../../services/user/find-user";
import { updateUsers } from "../../services/user/update-user";
import type { User } from "../../types/user";

const updateUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().optional(),
  displayName: z.string().min(3, "Display name must be at least 3 characters long").optional(),
  avatarPath: z.string().url().nullable().optional(),
  favouredTypeId: z.number().int().positive().nullable().optional(),
  oldPassword: z.string().min(3, "Password must be at least 3 characters long").optional(),
  newPassword: z.string().min(3, "Password must be at least 3 characters long").optional(),
});

export async function updateUserAction(
  data: z.infer<typeof updateUserSchema>
): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    const validated = updateUserSchema.parse(data);

    // Get existing user to merge with updates
    const existing = await findUsersById(validated.id);
    if (!existing) {
      return { success: false, error: "User not found" };
    }

    // Merge existing user with updates
    const fullUser: User = {
      id: existing.id,
      email: validated.email ?? existing.email,
      displayName: validated.displayName ?? existing.displayName,
      avatarPath: validated.avatarPath !== undefined ? validated.avatarPath : existing.avatarPath,
      favouredTypeId: validated.favouredTypeId !== undefined ? validated.favouredTypeId : existing.favouredTypeId,
    };

    const result = await updateUsers(fullUser);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}
