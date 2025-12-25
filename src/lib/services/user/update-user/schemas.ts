import { z } from "zod";

export const UpdateUserSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  avatarPath: z.string().nullable(),
  favouredTypeId: z.number().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
