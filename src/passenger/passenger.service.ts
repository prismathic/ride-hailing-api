import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDriverDto } from 'src/driver/create-driver.dto';
import { Repository } from 'typeorm';
import { Passenger } from './passenger.entity';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  getById(id: string): Promise<Passenger | undefined> {
    return this.passengerRepository.findOneBy({ id });
  }

  getAll(): Promise<Passenger[]> {
    return this.passengerRepository.find();
  }

  create(createPassengerDto: CreateDriverDto) {
    return this.passengerRepository.insert(createPassengerDto);
  }
}
