import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../driver/driver.entity';
import { Passenger } from '../passenger/passenger.entity';
import { In, Repository } from 'typeorm';
import { CreateRideDto } from './dtos/create-ride.dto';
import { CannotCreateRideError } from './exceptions/cannot-create-ride.error';
import { CannotStopRideError } from './exceptions/cannot-stop-ride.error';
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

  getAll(status?: RideStatuses): Promise<Ride[]> {
    const statuses = status
      ? [status]
      : [RideStatuses.ONGOING, RideStatuses.DONE];

    return this.rideRepository.find({
      where: {
        status: In(statuses),
      },
      loadRelationIds: true,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(
    driver: Driver,
    passenger: Passenger,
    locationPoints: CreateRideDto,
  ): Promise<Ride> {
    if (!driver || !passenger) {
      throw new CannotCreateRideError('Invalid driver/passenger passed.');
    }

    if (driver.isSuspended) {
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

    if (locationPoints.pickupPoint == locationPoints.destinationPoint) {
      throw new CannotCreateRideError(
        'The pickup point and destination point cannot be the same.',
      );
    }

    const newRide = new Ride();

    newRide.driver = driver;
    newRide.passenger = passenger;
    newRide.status = RideStatuses.ONGOING;
    newRide.pickupPoint = locationPoints.pickupPoint;
    newRide.destinationPoint = locationPoints.destinationPoint;

    const { id } = await this.rideRepository.save(newRide);

    return this.rideRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async stop(rideId: string): Promise<Ride | undefined> {
    const ride = await this.getById(rideId);

    if (!ride) {
      throw new CannotStopRideError('Invalid ride selected.');
    }

    if (ride.status === RideStatuses.DONE) {
      throw new CannotStopRideError(
        'The selected ride has already been concluded.',
      );
    }

    ride.status = RideStatuses.DONE;

    const { id } = await this.rideRepository.save(ride);

    return this.rideRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }
}
