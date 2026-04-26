import "server-only";

import { db } from "../../db";
import * as schema from "../../db/schema";

export type FindRolesOutput = {
  id: number;
  name: string;
};

export async function findRoles(): Promise<FindRolesOutput[]> {
  return db.select({ id: schema.roles.id, name: schema.roles.name }).from(schema.roles).orderBy(schema.roles.name);
}
