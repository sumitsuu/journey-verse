import "server-only";

import { and, count, desc, eq, ilike, inArray, or, SQL } from "drizzle-orm";

import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { findUserRoles, type UserRoleName } from "./find-user-roles.service";

const FindUsersInputSchema = z.object({
  filters: z.object({
    email: z.string().email().optional(),
  }),
});

const FindUsersPageSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type FindUsersInput = z.infer<typeof FindUsersInputSchema>;
export type FindUsersOutput = Omit<typeof schema.users.$inferSelect, "password"> & {
  roles: UserRoleName[];
};

export type FindUsersPageInput = z.infer<typeof FindUsersPageSchema>;
export type FindUsersPageOutput = {
  items: FindUsersOutput[];
  total: number;
  page: number;
  pageSize: number;
};

export async function findUsers({ filters }: FindUsersInput): Promise<FindUsersOutput[]> {
  const whereClause = buildFindUsersFilters(filters);
  const base = db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      displayName: schema.users.displayName,
      avatarPath: schema.users.avatarPath,
      favouredTypeId: schema.users.favouredTypeId,
    })
    .from(schema.users);
  const users = whereClause.length ? await base.where(and(...whereClause)) : await base;

  return await Promise.all(
    users.map(async (user) => ({
      ...user,
      roles: await findUserRoles(user.id),
    }))
  );
}

export async function findUsersPage(raw: FindUsersPageInput): Promise<FindUsersPageOutput> {
  const { search, page, pageSize } = FindUsersPageSchema.parse(raw);
  const whereClause = buildAdminListFilters(search);

  const countBase = db.select({ n: count() }).from(schema.users);
  const [{ n: total }] = whereClause.length
    ? await countBase.where(and(...whereClause))
    : await countBase;

  const listBase = db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      displayName: schema.users.displayName,
      avatarPath: schema.users.avatarPath,
      favouredTypeId: schema.users.favouredTypeId,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const rows = whereClause.length ? await listBase.where(and(...whereClause)) : await listBase;

  const items = await attachRolesBatch(rows);
  return { items, total, page, pageSize };
}

async function attachRolesBatch(
  rows: {
    id: number;
    email: string;
    displayName: string;
    avatarPath: string | null;
    favouredTypeId: number | null;
  }[]
): Promise<FindUsersOutput[]> {
  if (rows.length === 0) {
    return [];
  }
  const ids = rows.map((r) => r.id);
  const roleRows = await db
    .select({ userId: schema.userRoles.userId, name: schema.roles.name })
    .from(schema.userRoles)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.userRoles.roleId))
    .where(inArray(schema.userRoles.userId, ids));

  const byUser = new Map<number, UserRoleName[]>();
  for (const row of roleRows) {
    const list = byUser.get(row.userId) ?? [];
    list.push(row.name as UserRoleName);
    byUser.set(row.userId, list);
  }

  return rows.map((row) => ({
    ...row,
    roles: byUser.get(row.id) ?? [],
  }));
}

const buildFindUsersFilters = (filters: FindUsersInput["filters"]): SQL[] => {
  const filtersArray: SQL[] = [];
  if (filters?.email) {
    filtersArray.push(eq(schema.users.email, filters.email));
  }
  return filtersArray;
};

const buildAdminListFilters = (search: string | undefined): SQL[] => {
  const q = search?.trim();
  if (!q) {
    return [];
  }
  const pattern = `%${q}%`;
  return [or(ilike(schema.users.email, pattern), ilike(schema.users.displayName, pattern))!];
};
