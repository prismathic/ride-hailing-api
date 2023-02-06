import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

const user = { email: 'email@email.com', id: 'a uuid', name: 'James Bond' };
const signedJwt = 'signedJwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload) => signedJwt),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user successfully', async () => {
      const email = 'testemail@email.com';
      const password = 'testpassword';

      const userServiceSpy = jest.spyOn(userService, 'findOne');

      jest.spyOn(bcrypt, 'compare').mockImplementation((plain, hashed) => true);

      expect(await authService.validateUser(email, password)).toEqual(user);
      expect(userServiceSpy).toBeCalledWith(email);
    });

    it('should return null when user is nonexistent', async () => {
      const email = 'nonexistent@email.com';
      const password = 'testpassword';

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      expect(await authService.validateUser(email, password)).toBeNull();
    });

    it('should return null when the password is invalid', async () => {
      const email = 'testemail@email.com';
      const password = 'invalidpassword';

      const userServiceSpy = jest.spyOn(userService, 'findOne');

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((plain, hashed) => false);

      expect(await authService.validateUser(email, password)).toBeNull();
      expect(userServiceSpy).toBeCalledWith(email);
    });
  });

  describe('login', () => {
    it('should return logged in user access token and details', async () => {
      const loggedInUser = new User();

      expect(await authService.login(loggedInUser)).toEqual({
        access_token: signedJwt,
        user: {
          email: loggedInUser.email,
          id: loggedInUser.id,
          name: loggedInUser.name,
        },
      });
    });
  });
});
