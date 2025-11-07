import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginBodyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
