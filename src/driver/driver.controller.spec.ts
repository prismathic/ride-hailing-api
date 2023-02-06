import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { CreateDriverDto } from './create-driver.dto';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { CannotCreateDriverError } from './errors/cannot-create-driver.error';

describe('DriverController', () => {
  let driverController: DriverController;
  let driverService: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                id: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                suspendedAt: null,
                createdAt: '2023-02-03T09:34:46.748Z',
              },
            ]),
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                isSuspended: false,
                suspendedAt: null,
                createdAt: '2023-02-03T09:34:46.748Z',
              }),
            ),
            suspend: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                suspendedAt: new Date(),
                createdAt: '2023-02-03T09:34:46.748Z',
              }),
            ),
            unsuspend: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                suspendedAt: null,
                createdAt: '2023-02-03T09:34:46.748Z',
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((createDriverDto: CreateDriverDto) =>
                Promise.resolve({
                  id: 'a uuid',
                  ...createDriverDto,
                  isSuspended: false,
                  suspendedAt: null,
                  createdAt: new Date(),
                }),
              ),
          },
        },
      ],
    }).compile();

    driverController = module.get<DriverController>(DriverController);
    driverService = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(driverController).toBeDefined();
  });

  describe('index', () => {
    it('should return a listing of drivers', async () => {
      expect(await driverController.index()).toEqual(
        JsonResponse.create('Drivers retrieved successfully.', [
          {
            id: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            name: 'Kenneth Roe',
            phoneNumber: '+2347035643433',
            suspendedAt: null,
            createdAt: '2023-02-03T09:34:46.748Z',
          },
        ]),
      );
    });
  });

  describe('create', () => {
    it('should create a driver', async () => {
      const createDriverDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      expect(await driverController.create(createDriverDto)).toEqual(
        JsonResponse.create('Driver created successfully.', {
          id: 'a uuid',
          ...createDriverDto,
          isSuspended: false,
          suspendedAt: null,
          createdAt: new Date(),
        }),
      );
    });

    it('should throw a bad request exception if service throws error', async () => {
      const createDriverDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      jest
        .spyOn(driverService, 'create')
        .mockImplementation((createDriverDto: CreateDriverDto) => {
          throw new CannotCreateDriverError(
            'A driver already exists with the selected phone number.',
          );
        });

      await expect(driverController.create(createDriverDto)).rejects.toEqual(
        new BadRequestException(
          'A driver already exists with the selected phone number.',
        ),
      );
    });
  });

  describe('suspend', () => {
    it('should suspend a driver', async () => {
      expect(await driverController.suspend('a uuid')).toEqual(
        JsonResponse.create('Driver suspended successfully.'),
      );
    });

    it('should throw a bad request exception if the driver does not exist', async () => {
      jest
        .spyOn(driverService, 'getById')
        .mockImplementation((id: string) => null);

      await expect(driverController.suspend('a uuid')).rejects.toEqual(
        new BadRequestException('Driver does not exist.'),
      );
    });

    it('should throw a bad request exception if the driver is already suspended', async () => {
      jest.spyOn(driverService, 'getById').mockImplementation((id: string) =>
        Promise.resolve({
          id,
          name: 'Roe Kenneth',
          phoneNumber: '+2347035643433',
          isSuspended: true,
          suspendedAt: new Date(),
          createdAt: new Date(),
          rides: [],
        }),
      );

      await expect(driverController.suspend('a uuid')).rejects.toEqual(
        new BadRequestException(
          'The selected driver has already been suspended.',
        ),
      );
    });
  });

  describe('unsuspend', () => {
    it("should remove a driver's suspension", async () => {
      jest.spyOn(driverService, 'getById').mockImplementation((id: string) =>
        Promise.resolve({
          id,
          name: 'Roe Kenneth',
          phoneNumber: '+2347035643433',
          isSuspended: true,
          suspendedAt: new Date(),
          createdAt: new Date(),
          rides: [],
        }),
      );

      expect(await driverController.unsuspend('a uuid')).toEqual(
        JsonResponse.create('Suspension removed successfully.'),
      );
    });

    it('should throw a bad request exception if the driver does not exist', async () => {
      jest
        .spyOn(driverService, 'getById')
        .mockImplementation((id: string) => null);

      await expect(driverController.unsuspend('a uuid')).rejects.toEqual(
        new BadRequestException('Driver does not exist.'),
      );
    });

    it('should throw a bad request exception if the driver is not under suspension', async () => {
      jest.spyOn(driverService, 'getById').mockImplementation((id: string) =>
        Promise.resolve({
          id,
          name: 'Kenneth Roe',
          phoneNumber: '+2347035643433',
          isSuspended: false,
          suspendedAt: null,
          createdAt: new Date(),
          rides: [],
        }),
      );

      await expect(driverController.unsuspend('a uuid')).rejects.toEqual(
        new BadRequestException('The selected driver is not under suspension.'),
      );
    });
  });
});
