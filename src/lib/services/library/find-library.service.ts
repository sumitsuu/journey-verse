import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

const FindLibraryInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export type FindLibraryOutput = typeof schema.library.$inferSelect;
export type FindLibraryInput = z.infer<typeof FindLibraryInputSchema>;

export const findLibrary = async ({ artId, userId }: FindLibraryInput): Promise<FindLibraryOutput | undefined> => {
  const [library] = await db
    .select()
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), eq(schema.library.userId, userId)))
    .limit(1);

  return library ?? undefined;
};
