import type { InferSelectModel } from "drizzle-orm";

import { statusTranslations, statuses } from "../db/schema";

type StatusRow = InferSelectModel<typeof statuses>;
type StatusTranslationRow = InferSelectModel<typeof statusTranslations>;

export type Status = {
  id: StatusRow["id"];
  name: StatusTranslationRow["name"] | null;
};
