import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './login.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) return null;

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) return null;

    return user;
  }

  async login(user: User) {
    const { email, name, id } = user;

    const payload = { email, sub: id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email,
        id,
        name,
      },
    };
  }

  async attempt(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return null;
    }
    return this.login(user);
  }
}
