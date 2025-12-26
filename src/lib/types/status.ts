import { statusTranslations, statuses } from "../db/schema";

export type Status = {
  id: (typeof statuses.$inferSelect)["id"];
  name: (typeof statusTranslations.$inferSelect)["name"];
};
