import z from "zod";

export const CreateLibraryInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  rating: z.number().min(0).max(10).optional(),
  episodes: z.number().int().min(0),
});

export type CreateLibraryInput = z.infer<typeof CreateLibraryInputSchema>;
