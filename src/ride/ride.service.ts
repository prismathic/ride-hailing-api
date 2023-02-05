import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from 'src/driver/driver.entity';
import { Passenger } from 'src/passenger/passenger.entity';
import { In, Repository } from 'typeorm';
import { CannotCreateRideError } from './exceptions/cannot-create-ride.error';
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
    const statuses = status
      ? [status]
      : [RideStatuses.ONGOING, RideStatuses.DONE];

    return this.rideRepository.find({
      where: {
        status: In(statuses),
      },
    });
  }

  async create(driver: Driver, passenger: Passenger): Promise<Ride> {
    if (!driver || !passenger) {
      throw new CannotCreateRideError('Invalid driver/passenger passed.');
    }

    if (driver.suspendedAt) {
      throw new CannotCreateRideError(
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
      throw new CannotCreateRideError(
        'The driver/passenger already has an ongoing trip.',
      );
    }

    const newRide = new Ride();

    newRide.driver = driver;
    newRide.passenger = passenger;
    newRide.status = RideStatuses.ONGOING;

    return this.rideRepository.save(newRide);
  }

  async stop(rideId: string): Promise<Ride> {
    const ride = await this.getById(rideId);

    if (!ride) return null;

    ride.status = RideStatuses.DONE;

    return this.rideRepository.save(ride);
  }
}
