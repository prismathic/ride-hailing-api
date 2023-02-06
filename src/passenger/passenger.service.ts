import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDriverDto } from '../driver/create-driver.dto';
import { Repository } from 'typeorm';
import { CannotCreatePassengerError } from './errors/cannot-create-passenger.error';
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

  async create(createPassengerDto: CreateDriverDto) {
    const passengerExists = await this.passengerRepository.findOne({
      where: { phoneNumber: createPassengerDto.phoneNumber },
    });

    if (passengerExists) {
      throw new CannotCreatePassengerError(
        'A passenger already exists with the selected phone number.',
      );
    }

    return this.passengerRepository.save(createPassengerDto);
  }
}
