import z from "zod";
import { localesEnum, statusTypeEnum } from "../../db/schema";

export const FindStatusesInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  type: z.enum(statusTypeEnum.enumValues),
});

export type FindStatusesInput = z.infer<typeof FindStatusesInputSchema>;
