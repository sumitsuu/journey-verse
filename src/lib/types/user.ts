import type { InferSelectModel } from "drizzle-orm";

import { users } from "../db/schema";

type UserRow = InferSelectModel<typeof users>;

export type User = {
  id: UserRow["id"];
  email: UserRow["email"];
  displayName: UserRow["displayName"];
  avatarPath: UserRow["avatarPath"];
  favouredTypeId: UserRow["favouredTypeId"];
};
