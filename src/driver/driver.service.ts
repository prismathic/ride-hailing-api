import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './create-driver.dto';
import { Driver } from './driver.entity';

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

  create(createDriverDto: CreateDriverDto) {
    return this.driverRepository.insert(createDriverDto);
  }

  suspend(id: string) {
    return this.driverRepository.update(id, { suspendedAt: new Date() });
  }

  unsuspend(id: string) {
    return this.driverRepository.update(id, { suspendedAt: null });
  }
}
