import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './create-driver.dto';
import { Driver } from './driver.entity';
import { DriverService } from './driver.service';
import { CannotCreateDriverError } from './errors/cannot-create-driver.error';

const driverArray = [
  { name: 'Kenneth Roe', phoneNumber: '+2347035643433' },
  { name: 'Justin Moon', phoneNumber: '+23490321643433' },
  { name: 'Jackson Mike', phoneNumber: '+2347015643221' },
];

const singleDriver = driverArray[0];

describe('DriverService', () => {
  let driverService: DriverService;
  let driverRepository: Repository<Driver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            find: jest.fn().mockResolvedValue(driverArray),
            findOneBy: jest.fn().mockResolvedValue(singleDriver),
            findOne: jest.fn().mockResolvedValue(singleDriver),
            save: jest
              .fn()
              .mockImplementation((createDriverDto: CreateDriverDto) =>
                Promise.resolve(createDriverDto),
              ),
            update: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    driverService = module.get<DriverService>(DriverService);
    driverRepository = module.get<Repository<Driver>>(
      getRepositoryToken(Driver),
    );
  });

  it('should be defined', () => {
    expect(driverService).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all drivers', async () => {
      expect(await driverService.getAll()).toEqual(driverArray);
    });
  });

  describe('getById', () => {
    it('should get a single driver', async () => {
      const testId = 'atestId';
      const driverRepositorySpy = jest.spyOn(driverRepository, 'findOneBy');

      expect(await driverService.getById(testId)).toEqual(singleDriver);
      expect(driverRepositorySpy).toBeCalledWith({ id: testId });
    });
  });

  describe('create', () => {
    it('should create a driver successfully', async () => {
      const createDriverDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      jest.spyOn(driverRepository, 'findOne').mockImplementation(() => null);

      const driverRepositorySpy = jest.spyOn(driverRepository, 'save');

      expect(await driverService.create(createDriverDto)).toEqual(
        createDriverDto,
      );
      expect(driverRepositorySpy).toBeCalledWith(createDriverDto);
    });

    it('should not create a driver if a duplicate driver exists', async () => {
      const createDriverDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      const driverRepositorySpy = jest
        .spyOn(driverRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(new Driver()));

      await expect(driverService.create(createDriverDto)).rejects.toEqual(
        new CannotCreateDriverError(
          'A driver already exists with the selected phone number.',
        ),
      );
      expect(driverRepositorySpy).toBeCalledWith({
        where: { phoneNumber: createDriverDto.phoneNumber },
      });
    });
  });

  describe('suspend', () => {
    it('should suspend a driver', async () => {
      const testId = 'atestId';
      const driverRepositorySpy = jest.spyOn(driverRepository, 'update');
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

      expect(await driverService.suspend(testId)).toBe(true);
      expect(driverRepositorySpy).toBeCalledWith(testId, {
        isSuspended: true,
        suspendedAt: new Date('2020-01-01'),
      });
    });
  });

  describe('unsuspend', () => {
    it('should unsuspend a driver', async () => {
      const testId = 'atestId';
      const driverRepositorySpy = jest.spyOn(driverRepository, 'update');

      expect(await driverService.unsuspend(testId)).toBe(true);
      expect(driverRepositorySpy).toBeCalledWith(testId, {
        isSuspended: false,
        suspendedAt: null,
      });
    });
  });
});
