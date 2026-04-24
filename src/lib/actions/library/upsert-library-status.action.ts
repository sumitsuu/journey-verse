"use server";

import { z } from "zod";

import { authorizeAccess } from "../../services/auth/authorize-access";
import { upsertLibraryStatus } from "../../services/library/upsert-library-status.service";

const upsertLibraryStatusSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
});

export async function upsertLibraryStatusAction(data: z.infer<typeof upsertLibraryStatusSchema>): Promise<void> {
  try {
    const validated = upsertLibraryStatusSchema.parse(data);
    await authorizeAccess({ userId: validated.userId });

    await upsertLibraryStatus({
      artId: validated.artId,
      userId: validated.userId,
      statusId: validated.statusId,
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to upsert library status");
  }
}
