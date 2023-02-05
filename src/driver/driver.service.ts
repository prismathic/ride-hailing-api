import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './create-driver.dto';
import { Driver } from './driver.entity';
import { CannotCreateDriverError } from './errors/cannot-create-driver.error';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
  ) {}

  getById(id: string): Promise<Driver | undefined> {
    return this.driverRepository.findOneBy({ id });
  }

  getAll(): Promise<Driver[]> {
    return this.driverRepository.find();
  }

  async create(createDriverDto: CreateDriverDto) {
    const driverExists = await this.driverRepository.findOne({
      where: { phoneNumber: createDriverDto.phoneNumber },
    });

    if (driverExists) {
      throw new CannotCreateDriverError(
        'A driver already exists with the selected phone number.',
      );
    }
    return this.driverRepository.save(createDriverDto);
  }

  suspend(id: string) {
    return this.driverRepository.update(id, {
      isSuspended: true,
      suspendedAt: new Date(),
    });
  }

  unsuspend(id: string) {
    return this.driverRepository.update(id, {
      isSuspended: false,
      suspendedAt: null,
    });
  }
}
