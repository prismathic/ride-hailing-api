import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Driver } from '../driver/driver.entity';
import { Passenger } from '../passenger/passenger.entity';
import { CreateRideDto } from './dtos/create-ride.dto';
import { CannotCreateRideError } from './exceptions/cannot-create-ride.error';
import { CannotStopRideError } from './exceptions/cannot-stop-ride.error';
import { Ride, RideStatuses } from './ride.entity';
import { RideService } from './ride.service';

const rideArray = [
  {
    id: '1496bbb9-576c-445e-8d7c-8ab6c8455fed',
    status: RideStatuses.ONGOING,
    pickupPoint: '(7.348720, 3.879290)',
    destinationPoint: '(6.524379, 3.379206)',
    createdAt: '2023-02-03T21:39:36.787Z',
    updatedAt: '2023-02-03T22:56:56.468Z',
    driver: new Driver(),
    passenger: new Passenger(),
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
];

const singleRide = {
  id: '1496bbb9-576c-445e-8d7c-8ab6c8455fd',
  status: RideStatuses.ONGOING,
  pickupPoint: '(7.348720, 3.879290)',
  destinationPoint: '(6.524379, 3.379206)',
  createdAt: new Date(),
  updatedAt: new Date(),
  driver: new Driver(),
  passenger: new Passenger(),
};

describe('RideService', () => {
  let rideService: RideService;
  let rideRepository: Repository<Ride>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideService,
        {
          provide: getRepositoryToken(Ride),
          useValue: {
            find: jest.fn().mockResolvedValue(rideArray),
            findOneBy: jest.fn().mockResolvedValue(singleRide),
            findOne: jest.fn().mockResolvedValue(singleRide),
            count: jest.fn().mockResolvedValue(0),
            save: jest
              .fn()
              .mockImplementation((createRideDto: CreateRideDto) =>
                Promise.resolve(createRideDto),
              ),
            update: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    rideService = module.get<RideService>(RideService);
    rideRepository = module.get<Repository<Ride>>(getRepositoryToken(Ride));
  });

  it('should be defined', () => {
    expect(rideService).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all rides', async () => {
      const rideRepositorySpy = jest.spyOn(rideRepository, 'find');

      expect(await rideService.getAll()).toEqual(rideArray);
      expect(rideRepositorySpy).toBeCalledWith({
        where: {
          status: In([RideStatuses.ONGOING, RideStatuses.DONE]),
        },
        loadRelationIds: true,
        order: {
          createdAt: 'DESC',
        },
      });
    });

    it('should get all ongoing rides', async () => {
      const rideRepositorySpy = jest.spyOn(rideRepository, 'find');

      expect(await rideService.getAll(RideStatuses.ONGOING)).toEqual(rideArray);

      expect(rideRepositorySpy).toBeCalledWith({
        where: {
          status: In([RideStatuses.ONGOING]),
        },
        loadRelationIds: true,
        order: {
          createdAt: 'DESC',
        },
      });
    });
  });

  describe('getById', () => {
    it('should get a single ride', async () => {
      const testId = 'atestId';
      const rideRepositorySpy = jest.spyOn(rideRepository, 'findOneBy');

      expect(await rideService.getById(testId)).toEqual(singleRide);
      expect(rideRepositorySpy).toBeCalledWith({ id: testId });
    });
  });

  describe('create', () => {
    it('should create a ride successfully', async () => {
      const driver = new Driver();
      const passenger = new Passenger();

      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      expect(
        await rideService.create(driver, passenger, createRideDto),
      ).toEqual(singleRide);
      expect(rideRepositorySpy).toBeCalledWith({
        driver,
        passenger,
        ...createRideDto,
        status: RideStatuses.ONGOING,
      });
    });

    it('should not create a ride if driver is suspended', async () => {
      const driver = new Driver();
      driver.isSuspended = true;

      const passenger = new Passenger();

      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      await expect(
        rideService.create(driver, passenger, createRideDto),
      ).rejects.toEqual(
        new CannotCreateRideError('Cannot create ride for a suspended driver.'),
      );
      expect(rideRepositorySpy).toBeCalledTimes(0);
    });

    it('should not create a ride if driver or passenger has an ongoing ride', async () => {
      const driver = new Driver();
      driver.isSuspended = false;

      const passenger = new Passenger();

      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(6.524379, 3.379206)',
      };

      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      jest.spyOn(rideRepository, 'count').mockResolvedValue(5);

      await expect(
        rideService.create(driver, passenger, createRideDto),
      ).rejects.toEqual(
        new CannotCreateRideError(
          'The driver/passenger already has an ongoing trip.',
        ),
      );
      expect(rideRepositorySpy).toBeCalledTimes(0);
    });

    it('should not create a ride if pickup and destination points are the same', async () => {
      const driver = new Driver();
      driver.isSuspended = false;

      const passenger = new Passenger();

      const createRideDto = {
        pickupPoint: '(7.348720, 3.879290)',
        destinationPoint: '(7.348720, 3.879290)',
      };

      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      await expect(
        rideService.create(driver, passenger, createRideDto),
      ).rejects.toEqual(
        new CannotCreateRideError(
          'The pickup point and destination point cannot be the same.',
        ),
      );
      expect(rideRepositorySpy).toBeCalledTimes(0);
    });
  });

  describe('stop', () => {
    it('should stop a ride', async () => {
      const testId = 'atestId';
      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      expect(await rideService.stop(testId)).toEqual(singleRide);
      expect(rideRepositorySpy).toBeCalledWith(singleRide);
    });

    it('should throw an error when an invalid ride id is passed', async () => {
      const testId = 'atestId';
      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      jest.spyOn(rideRepository, 'findOneBy').mockImplementation(() => null);

      await expect(rideService.stop(testId)).rejects.toEqual(
        new CannotStopRideError('Invalid ride selected.'),
      );
      expect(rideRepositorySpy).toBeCalledTimes(0);
    });

    it('should throw an error if the ride is already concluded', async () => {
      const testId = 'atestId';
      const rideRepositorySpy = jest.spyOn(rideRepository, 'save');

      const updatedRide = singleRide;
      updatedRide.status = RideStatuses.DONE;

      jest
        .spyOn(rideRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(updatedRide));

      await expect(rideService.stop(testId)).rejects.toEqual(
        new CannotStopRideError(
          'The selected ride has already been concluded.',
        ),
      );
      expect(rideRepositorySpy).toBeCalledTimes(0);
    });
  });
});
