"use server";

import { z } from "zod";

import { requireAdminSession } from "../../services/auth/authorize-access";
import { patchUser, type UpdateUserOutput } from "../../services/user/update-user.service";

const patchUserAdminSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().optional(),
  displayName: z.string().min(3).optional(),
  avatarPath: z.string().nullable().optional(),
  favouredTypeId: z.number().int().positive().nullable().optional(),
});

export async function patchUserAdminAction(data: z.infer<typeof patchUserAdminSchema>): Promise<UpdateUserOutput> {
  await requireAdminSession();
  const validated = patchUserAdminSchema.parse(data);
  const { id, ...patch } = validated;
  return patchUser(id, patch);
}
