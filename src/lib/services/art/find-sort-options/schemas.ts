import { localesEnum } from "@/src/lib/db/schema";
import type { Genre } from "@/src/lib/types/art";
import type { Status } from "@/src/lib/types/status";
import { z } from "zod";

export const FindSortOptionsInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  typeId: z.number().int().positive(),
});

export type FindSortOptionsInput = z.infer<typeof FindSortOptionsInputSchema>;
export type FindSortOptionsOutput = {
  genres: Genre[];
  statuses: Status[];
  years: number[];
};
