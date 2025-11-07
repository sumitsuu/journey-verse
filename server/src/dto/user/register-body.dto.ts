import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterBodyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Display Name is required" })
  displayName: string;
}
