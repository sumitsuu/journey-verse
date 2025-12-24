import { localesEnum } from "@/src/lib/db/schema";
import z from "zod";

export const FindArtsFiltersSchema = z.object({
  typeId: z.number().int().positive().optional(),
  genres: z.array(z.string()).or(z.string()).optional(),
  rating: z.string().optional(),
  yearStart: z.string().optional(),
  yearEnd: z.string().optional(),
});

export const FindArtsInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  filters: FindArtsFiltersSchema,
});

export type FindArtsInput = z.infer<typeof FindArtsInputSchema>;
export type FindArtsFilters = z.infer<typeof FindArtsFiltersSchema>;
