import "server-only";

import { and, eq, exists } from "drizzle-orm";

import { db } from "../../../db";
import * as schema from "../../../db/schema";
import { CheckIsInLibraryInput } from "./schemas";

export async function checkIsInLibrary({ artId, userId }: CheckIsInLibraryInput): Promise<boolean> {
  const [row] = await db
    .select({
      isInLibrary: exists(
        db
          .select()
          .from(schema.library)
          .where(and(eq(schema.library.artId, artId), eq(schema.library.userId, userId)))
      ),
    })
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), eq(schema.library.userId, userId)));

  return !!row;
}
