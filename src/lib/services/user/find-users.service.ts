import "server-only";

import { and, eq, SQL } from "drizzle-orm";

import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

const FindUsersInputSchema = z.object({
  filters: z.object({
    email: z.string().email().optional(),
  }),
});

export type FindUsersInput = z.infer<typeof FindUsersInputSchema>;
export type FindUsersOutput = Omit<typeof schema.users.$inferSelect, "password">;

export async function findUsers({ filters }: FindUsersInput): Promise<FindUsersOutput[]> {
  const whereClause = buildFindUsersFilters(filters);

  const users = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      displayName: schema.users.displayName,
      avatarPath: schema.users.avatarPath,
      favouredTypeId: schema.users.favouredTypeId,
    })
    .from(schema.users)
    .where(and(...whereClause));

  return users;
}

const buildFindUsersFilters = (filters: FindUsersInput["filters"]): SQL[] => {
  const filtersArray: SQL[] = [];
  if (filters?.email) {
    filtersArray.push(eq(schema.users.email, filters.email));
  }
  return filtersArray;
};
