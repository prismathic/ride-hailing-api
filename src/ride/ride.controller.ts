import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { DriverService } from 'src/driver/driver.service';
import { PassengerService } from 'src/passenger/passenger.service';
import { RideStatuses } from './ride.entity';
import { RideService } from './ride.service';

@Controller('ride')
export class RideController {
  constructor(
    private rideService: RideService,
    @Inject(DriverService) private driverService: DriverService,
    @Inject(PassengerService) private passengerService: PassengerService,
  ) {}

  @Get('')
  async index() {
    return await this.rideService.getAll();
  }

  @Get('ongoing')
  async getOngoingRides() {
    return await this.rideService.getAll(RideStatuses.ONGOING);
  }

  @Post(':rideId/stop')
  async stop(@Param('rideId') rideId: string) {
    const ride = await this.rideService.getById(rideId);

    return await this.rideService.stop(ride);
  }

  @Post(':passengerId/:driverId')
  async create(@Param() params) {
    const passenger = await this.passengerService.getById(params.passengerId);

    if (!passenger) {
      throw new BadRequestException('Invalid passenger provided.');
    }

    const driver = await this.driverService.getById(params.driverId);

    if (!driver) {
      throw new BadRequestException('Invalid driver provided.');
    }

    return await this.rideService.create(driver, passenger);
  }
}
