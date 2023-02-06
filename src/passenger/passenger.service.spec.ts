import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from '../driver/create-driver.dto';
import { CannotCreatePassengerError } from './errors/cannot-create-passenger.error';
import { Passenger } from './passenger.entity';
import { PassengerService } from './passenger.service';

const passengerArray = [
  { name: 'Kenneth Roe', phoneNumber: '+2347035643433' },
  { name: 'Justin Moon', phoneNumber: '+23490321643433' },
  { name: 'Jackson Mike', phoneNumber: '+2347015643221' },
];

const singlePassenger = passengerArray[0];

describe('PassengerService', () => {
  let passengerService: PassengerService;
  let passengerRepository: Repository<Passenger>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: {
            find: jest.fn().mockResolvedValue(passengerArray),
            findOneBy: jest.fn().mockResolvedValue(singlePassenger),
            findOne: jest.fn().mockResolvedValue(singlePassenger),
            save: jest
              .fn()
              .mockImplementation((createPassengerDto: CreateDriverDto) =>
                Promise.resolve(createPassengerDto),
              ),
            update: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    passengerService = module.get<PassengerService>(PassengerService);
    passengerRepository = module.get<Repository<Passenger>>(
      getRepositoryToken(Passenger),
    );
  });

  it('should be defined', () => {
    expect(passengerService).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all passengers', async () => {
      expect(await passengerService.getAll()).toEqual(passengerArray);
    });
  });

  describe('getById', () => {
    it('should get a single passenger', async () => {
      const testId = 'atestId';
      const passengerRepositorySpy = jest.spyOn(
        passengerRepository,
        'findOneBy',
      );

      expect(await passengerService.getById(testId)).toEqual(singlePassenger);
      expect(passengerRepositorySpy).toBeCalledWith({ id: testId });
    });
  });

  describe('create', () => {
    it('should create a passenger successfully', async () => {
      const createPassengerDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      jest.spyOn(passengerRepository, 'findOne').mockImplementation(() => null);

      const passengerRepositorySpy = jest.spyOn(passengerRepository, 'save');

      expect(await passengerService.create(createPassengerDto)).toEqual(
        createPassengerDto,
      );
      expect(passengerRepositorySpy).toBeCalledWith(createPassengerDto);
    });

    it('should not create a driver if a duplicate passenger exists', async () => {
      const createPassengerDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      const passengerRepositorySpy = jest
        .spyOn(passengerRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(new Passenger()));

      await expect(passengerService.create(createPassengerDto)).rejects.toEqual(
        new CannotCreatePassengerError(
          'A passenger already exists with the selected phone number.',
        ),
      );
      expect(passengerRepositorySpy).toBeCalledWith({
        where: { phoneNumber: createPassengerDto.phoneNumber },
      });
    });
  });
});
