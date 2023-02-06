import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

const singleUser = { email: 'email@email.com' };

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(singleUser),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should get a single user by email', async () => {
      const emailForTest = 'email@email.com';
      const userRepositorySpy = jest.spyOn(userRepository, 'findOneBy');

      expect(await userService.findOne(emailForTest)).toEqual(singleUser);
      expect(userRepositorySpy).toBeCalledWith({ email: emailForTest });
    });
  });
});
