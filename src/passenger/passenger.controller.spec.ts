import { Test, TestingModule } from '@nestjs/testing';
import { PassengerController } from './passenger.controller';

describe('PassengerController', () => {
  let controller: PassengerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
    }).compile();

    controller = module.get<PassengerController>(PassengerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
