import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { Driver } from '../driver/driver.entity';
import { DriverService } from '../driver/driver.service';
import { Passenger } from '../passenger/passenger.entity';
import { PassengerService } from '../passenger/passenger.service';
import { CreateRideDto } from './dtos/create-ride.dto';
import { CannotCreateRideError } from './exceptions/cannot-create-ride.error';
import { CannotStopRideError } from './exceptions/cannot-stop-ride.error';
import { RideController } from './ride.controller';
import { RideStatuses } from './ride.entity';
import { RideService } from './ride.service';

describe('RideController', () => {
  let rideController: RideController;
  let rideService: RideService;
  let driverService: DriverService;
  let passengerService: PassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        {
          provide: PassengerService,
          useValue: {
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                createdAt: '2023-02-03T09:34:46.748Z',
              }),
            ),
          },
        },
        {
          provide: DriverService,
          useValue: {
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
          },
        },
        {
          provide: RideService,
          useValue: {
            getAll: jest.fn().mockImplementation((status?: string) =>
              Promise.resolve([
                {
                  id: '1496bbb9-576c-445e-8d7c-8ab6c8455fed',
                  status: RideStatuses.ONGOING,
                  pickupPoint: '(7.348720, 3.879290)',
                  destinationPoint: '(6.524379, 3.379206)',
                  createdAt: '2023-02-03T21:39:36.787Z',
                  updatedAt: '2023-02-03T22:56:56.468Z',
                  driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                  passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
                },
                {
                  id: '1b7e8a5d-7266-4dbc-85bd-5e6ea5b16cd0',
                  status: RideStatuses.ONGOING,
                  pickupPoint: '(7.348720, 3.879290)',
                  destinationPoint: '(6.524379, 3.379206)',
                  createdAt: '2023-02-03T22:18:52.866Z',
                  updatedAt: '2023-02-03T22:56:56.468Z',
                  driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                  passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
                },
              ]),
            ),
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                status: RideStatuses.ONGOING,
                pickupPoint: '(7.348720, 3.879290)',
                destinationPoint: '(6.524379, 3.379206)',
                createdAt: '2023-02-03T21:39:36.787Z',
                updatedAt: '2023-02-03T22:56:56.468Z',
                driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
              }),
            ),
            stop: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                status: RideStatuses.DONE,
                pickupPoint: '(7.348720, 3.879290)',
                destinationPoint: '(6.524379, 3.379206)',
                createdAt: '2023-02-03T21:39:36.787Z',
                updatedAt: '2023-02-03T22:56:56.468Z',
                driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
              }),
            ),
            create: jest
              .fn()
              .mockImplementation(
                (
                  driver: Driver,
                  passenger: Passenger,
                  createRideDto: CreateRideDto,
                ) =>
                  Promise.resolve({
                    id: 'a uuid',
                    ...createRideDto,
                    status: RideStatuses.ONGOING,
                    createdAt: '2023-02-03T21:39:36.787Z',
                    updatedAt: '2023-02-03T22:56:56.468Z',
                    driver: driver.id,
                    passenger: passenger.id,
                  }),
              ),
          },
        },
      ],
    }).compile();

    rideController = module.get<RideController>(RideController);
    rideService = module.get<RideService>(RideService);
    driverService = module.get<DriverService>(DriverService);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(rideController).toBeDefined();
  });

  describe('index', () => {
    it('should return a listing of all rides', async () => {
      expect(await rideController.index()).toEqual(
        JsonResponse.create('Rides retrieved successfully.', [
          {
            id: '1496bbb9-576c-445e-8d7c-8ab6c8455fed',
            status: RideStatuses.ONGOING,
            pickupPoint: '(7.348720, 3.879290)',
            destinationPoint: '(6.524379, 3.379206)',
            createdAt: '2023-02-03T21:39:36.787Z',
            updatedAt: '2023-02-03T22:56:56.468Z',
            driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
          },
          {
            id: '1b7e8a5d-7266-4dbc-85bd-5e6ea5b16cd0',
            status: RideStatuses.ONGOING,
            pickupPoint: '(7.348720, 3.879290)',
            destinationPoint: '(6.524379, 3.379206)',
            createdAt: '2023-02-03T22:18:52.866Z',
            updatedAt: '2023-02-03T22:56:56.468Z',
            driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
          },
        ]),
      );
    });
  });

  describe('getOngoingRides', () => {
    it('should return a listing of all ongoing rides', async () => {
      expect(await rideController.getOngoingRides()).toEqual(
        JsonResponse.create('Ongoing rides retrieved successfully.', [
          {
            id: '1496bbb9-576c-445e-8d7c-8ab6c8455fed',
            status: RideStatuses.ONGOING,
            pickupPoint: '(7.348720, 3.879290)',
            destinationPoint: '(6.524379, 3.379206)',
            createdAt: '2023-02-03T21:39:36.787Z',
            updatedAt: '2023-02-03T22:56:56.468Z',
            driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
          },
          {
            id: '1b7e8a5d-7266-4dbc-85bd-5e6ea5b16cd0',
            status: RideStatuses.ONGOING,
            pickupPoint: '(7.348720, 3.879290)',
            destinationPoint: '(6.524379, 3.379206)',
            createdAt: '2023-02-03T22:18:52.866Z',
            updatedAt: '2023-02-03T22:56:56.468Z',
            driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
          },
        ]),
      );
    });
  });

  describe('create', () => {
    it('should create a ride', async () => {
      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const params = { passengerId: 'passengerId', driverId: 'driverId' };

      expect(await rideController.create(params, createRideDto)).toEqual(
        JsonResponse.create('Ride created successfully.', {
          id: 'a uuid',
          ...createRideDto,
          status: RideStatuses.ONGOING,
          createdAt: '2023-02-03T21:39:36.787Z',
          updatedAt: '2023-02-03T22:56:56.468Z',
          driver: params.driverId,
          passenger: params.passengerId,
        }),
      );
    });

    it('should throw a bad request exception if passenger does not exist', async () => {
      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const params = { passengerId: 'passengerId', driverId: 'driverId' };

      jest
        .spyOn(passengerService, 'getById')
        .mockImplementation((id: string) => null);

      await expect(
        rideController.create(params, createRideDto),
      ).rejects.toEqual(new BadRequestException('Invalid passenger provided.'));
    });

    it('should throw a bad request exception if driver does not exist', async () => {
      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const params = { passengerId: 'passengerId', driverId: 'driverId' };

      jest
        .spyOn(driverService, 'getById')
        .mockImplementation((id: string) => null);

      await expect(
        rideController.create(params, createRideDto),
      ).rejects.toEqual(new BadRequestException('Invalid driver provided.'));
    });

    it('should throw a bad request exception if service throws error', async () => {
      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const params = { passengerId: 'passengerId', driverId: 'driverId' };

      const errorMessage = 'Cannot create ride.';

      jest
        .spyOn(rideService, 'create')
        .mockImplementation(
          (
            driver: Driver,
            passenger: Passenger,
            createRideDto: CreateRideDto,
          ) => {
            throw new CannotCreateRideError(errorMessage);
          },
        );

      await expect(
        rideController.create(params, createRideDto),
      ).rejects.toEqual(new BadRequestException(errorMessage));
    });
  });

  describe('stop', () => {
    it('should stop an ongoing ride', async () => {
      expect(await rideController.stop('a uuid')).toEqual(
        JsonResponse.create('Ride stopped successfully.', {
          id: 'a uuid',
          status: RideStatuses.DONE,
          pickupPoint: '(7.348720, 3.879290)',
          destinationPoint: '(6.524379, 3.379206)',
          createdAt: '2023-02-03T21:39:36.787Z',
          updatedAt: '2023-02-03T22:56:56.468Z',
          driver: 'dd505b71-a8ad-43bf-98d3-00964492457a',
          passenger: '82d459b8-740a-4746-8a8e-e79ba4130e77',
        }),
      );
    });

    it('should throw a bad request exception if service throws error', async () => {
      const errorMessage = 'Cannot stop ride.';

      jest.spyOn(rideService, 'stop').mockImplementation((id: string) => {
        throw new CannotStopRideError(errorMessage);
      });

      await expect(rideController.stop('a uuid')).rejects.toEqual(
        new BadRequestException(errorMessage),
      );
    });
  });
});
