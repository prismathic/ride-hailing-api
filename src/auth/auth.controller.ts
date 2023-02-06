import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req, @Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.authService.attempt(loginDto);

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    return JsonResponse.create('User logged in successfully.', user);
  }
}
