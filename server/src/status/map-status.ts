import { Prisma } from "@prisma/client";

type StatusWithTranslations = Prisma.StatusGetPayload<{
  include: {
    statusTranslations: true;
  };
}>;

export const mapStatus = (status: StatusWithTranslations) => {
  return {
    id: status.id,
    name: status.statusTranslations[0].name,
  };
};
