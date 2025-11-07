import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { LoginBodyDto } from "src/dto/user/login-body.dto";
import { RegisterBodyDto } from "src/dto/user/register-body.dto";
import { mapUser } from "src/user/map-user";

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  async login(body: LoginBodyDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new Error("No such user was found");
    }

    if (!(await argon2.verify(user.password, body.password))) {
      throw new Error("Password is incorrect");
    }

    return mapUser(user);
  }

  async register(body: RegisterBodyDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      throw new Error("User already exists");
    }

    const passwordHash = await argon2.hash(body.password);
    const createdUser = await this.prisma.user.create({
      data: {
        email: body.email,
        password: passwordHash,
        displayName: body.displayName,
      },
    });

    return mapUser(createdUser);
  }
}
