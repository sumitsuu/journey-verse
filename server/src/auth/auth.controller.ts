import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { LoginBodyDto } from "src/dto/user/login-body.dto";
import { RegisterBodyDto } from "src/dto/user/register-body.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: LoginBodyDto) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("register")
  async register(@Body() body: RegisterBodyDto) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
