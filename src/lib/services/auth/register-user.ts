"use server";

import { createUsers } from "../user/create-user";
import { findUsersByEmail } from "../user/find-user";

export async function registerUsers(data: { email: string; password: string; displayName: string }) {
  const existing = await findUsersByEmail(data.email);

  if (existing) {
    throw new Error("User already exists");
  }

  return await createUsers(data);
}
