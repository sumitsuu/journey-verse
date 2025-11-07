import { Prisma } from "@prisma/client";

type TypeWithTranslations = Prisma.TypeGetPayload<{
  include: {
    typeTranslations: true;
  };
}>;

export const mapType = (type: TypeWithTranslations) => {
  return {
    id: type.id,
    name: type.typeTranslations[0].name,
    catalogName: type.typeTranslations[0].catalogName,
  };
};
