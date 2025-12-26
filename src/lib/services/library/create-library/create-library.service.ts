import "server-only";

import { db } from "../../../db";
import * as schema from "../../../db/schema";
import { CreateLibraryInput } from "./schemas";

export async function createLibrary({ artId, userId, statusId, rating, episodes }: CreateLibraryInput) {
  const [library] = await db
    .insert(schema.library)
    .values({
      artId,
      userId,
      statusId,
      rating: rating !== undefined ? String(rating) : undefined,
      episodes,
    })
    .returning();
  return library;
}
