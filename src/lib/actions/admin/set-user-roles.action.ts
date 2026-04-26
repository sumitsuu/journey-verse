"use server";

import { z } from "zod";

import { requireAdminSession } from "../../services/auth/authorize-access";
import { setUserRoles, type SetUserRolesOutput } from "../../services/user/set-user-roles.service";

const schema = z.object({
  userId: z.number().int().positive(),
  roleNames: z.array(z.string()),
});

export async function setUserRolesAction(input: z.infer<typeof schema>): Promise<SetUserRolesOutput> {
  await requireAdminSession();
  return setUserRoles(schema.parse(input));
}
