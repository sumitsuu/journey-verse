import z from "zod";

export const CheckIsInLibraryInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export type CheckIsInLibraryInput = z.infer<typeof CheckIsInLibraryInputSchema>;
