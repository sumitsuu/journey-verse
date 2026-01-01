import z from "zod";
import { localesEnum } from "../../../db/schema";

export const FindTypesInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
});

export type FindTypesInput = z.infer<typeof FindTypesInputSchema>;
