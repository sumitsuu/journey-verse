import { Prisma } from "@prisma/client";
import { ClientUserDto } from "src/dto/user/client-user.dto";

type UserWithPayload = Prisma.UserGetPayload<{}>;

export const mapUser = (user: UserWithPayload): ClientUserDto => {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarPath: user.avatarPath,
    favouredTypeId: user.favouredTypeId,
  };
};
