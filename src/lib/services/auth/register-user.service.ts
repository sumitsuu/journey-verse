import "server-only";

import { CreateUserOutput, createUsers } from "../user/create-user.service";
import { findUsers } from "../user/find-users.service";

export async function registerUsers(data: {
  email: string;
  password: string;
  displayName: string;
}): Promise<CreateUserOutput> {
  const [existing] = await findUsers({ filters: { email: data.email } });

  if (existing) {
    throw new Error("User already exists");
  }

  return await createUsers(data);
}