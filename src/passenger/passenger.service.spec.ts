import { Test, TestingModule } from '@nestjs/testing';
import { PassengerService } from './passenger.service';

describe('PassengerService', () => {
  let service: PassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassengerService],
    }).compile();

    service = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
