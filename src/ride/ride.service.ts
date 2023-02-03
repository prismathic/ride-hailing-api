import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from 'src/driver/driver.entity';
import { Passenger } from 'src/passenger/passenger.entity';
import { Repository } from 'typeorm';
import { Ride, RideStatuses } from './ride.entity';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
  ) {}

  getById(id: string): Promise<Ride | undefined> {
    return this.rideRepository.findOneBy({ id });
  }

  getAll(status: RideStatuses = null): Promise<Ride[]> {
    const statusFilter = status ? { where: { status } } : null;

    return this.rideRepository.find(statusFilter);
  }

  async create(driver: Driver, passenger: Passenger) {
    if (driver.suspendedAt) {
      throw new BadRequestException(
        'Cannot create ride for a suspended driver.',
      );
    }

    const ongoingRides = await this.rideRepository.count({
      where: [
        { driver: { id: driver.id }, status: RideStatuses.ONGOING },
        { passenger: { id: passenger.id }, status: RideStatuses.ONGOING },
      ],
    });

    if (ongoingRides > 0) {
      throw new BadRequestException(
        'The driver/passenger already has an ongoing trip.',
      );
    }

    return this.rideRepository.insert({
      driver,
      passenger,
      status: RideStatuses.ONGOING,
    });
  }

  stop(ride: Ride): Promise<Ride> {
    ride.status = RideStatuses.STOPPED;

    return this.rideRepository.save(ride);
  }
}
