import {
  Body,
  Controller,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req, @Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.authService.attempt(loginDto);

    return user;
  }
}
