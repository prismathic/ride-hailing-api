import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            attempt: jest.fn().mockImplementation((loginDto: LoginDto) =>
              Promise.resolve({
                access_token: 'jwttoken',
                user: {
                  email: loginDto.email,
                  id: 'a uuid',
                  name: 'Kenneth Roe',
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto = {
        email: 'email@email.com',
        password: 'password',
      };

      expect(await authController.login(loginDto)).toEqual(
        JsonResponse.create('User logged in successfully.', {
          access_token: 'jwttoken',
          user: {
            email: loginDto.email,
            id: 'a uuid',
            name: 'Kenneth Roe',
          },
        }),
      );
    });

    it('should throw an exception if the user validation returns null', async () => {
      const loginDto = {
        email: 'invalidemail@email.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'attempt')
        .mockImplementation((loginDto: LoginDto) => null);

      await expect(authController.login(loginDto)).rejects.toEqual(
        new BadRequestException('Invalid credentials.'),
      );
    });
  });
});
