import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { CreateDriverDto } from '../driver/create-driver.dto';
import { CannotCreatePassengerError } from './errors/cannot-create-passenger.error';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

describe('PassengerController', () => {
  let passengerController: PassengerController;
  let passengerService: PassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
      providers: [
        {
          provide: PassengerService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                id: 'dd505b71-a8ad-43bf-98d3-00964492457a',
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                createdAt: '2023-02-03T09:34:46.748Z',
              },
            ]),
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'Kenneth Roe',
                phoneNumber: '+2347035643433',
                createdAt: '2023-02-03T09:34:46.748Z',
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((createPassengerDto: CreateDriverDto) =>
                Promise.resolve({
                  id: 'a uuid',
                  ...createPassengerDto,
                  createdAt: new Date(),
                }),
              ),
          },
        },
      ],
    }).compile();

    passengerController = module.get<PassengerController>(PassengerController);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(passengerController).toBeDefined();
  });

  describe('index', () => {
    it('should return a listing of passengers', async () => {
      expect(await passengerController.index()).toEqual(
        JsonResponse.create('Passengers retrieved successfully.', [
          {
            id: 'dd505b71-a8ad-43bf-98d3-00964492457a',
            name: 'Kenneth Roe',
            phoneNumber: '+2347035643433',
            createdAt: '2023-02-03T09:34:46.748Z',
          },
        ]),
      );
    });
  });

  describe('create', () => {
    it('should create a passenger', async () => {
      const createPassengerDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      expect(await passengerController.create(createPassengerDto)).toEqual(
        JsonResponse.create('Passenger created successfully.', {
          id: 'a uuid',
          ...createPassengerDto,
          createdAt: new Date(),
        }),
      );
    });

    it('should throw a bad request exception if service throws error', async () => {
      const createPassengerDto = {
        name: 'Lekki John',
        phoneNumber: '+2347089293456',
      };

      jest
        .spyOn(passengerService, 'create')
        .mockImplementation((createPassengerDto: CreateDriverDto) => {
          throw new CannotCreatePassengerError(
            'A passenger already exists with the selected phone number.',
          );
        });

      await expect(
        passengerController.create(createPassengerDto),
      ).rejects.toEqual(
        new BadRequestException(
          'A passenger already exists with the selected phone number.',
        ),
      );
    });
  });
});
