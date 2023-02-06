import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonResponse } from '../common/helpers/json-response.helper';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import { CreateRideDto } from './dtos/create-ride.dto';
import { CannotCreateRideError } from './exceptions/cannot-create-ride.error';
import { CannotStopRideError } from './exceptions/cannot-stop-ride.error';
import { RideStatuses } from './ride.entity';
import { RideService } from './ride.service';

@UseGuards(AuthGuard('jwt'))
@Controller('ride')
export class RideController {
  constructor(
    private rideService: RideService,
    @Inject(DriverService) private driverService: DriverService,
    @Inject(PassengerService) private passengerService: PassengerService,
  ) {}

  @Get('')
  async index() {
    const rides = await this.rideService.getAll();

    return JsonResponse.create('Rides retrieved successfully.', rides);
  }

  @Get('ongoing')
  async getOngoingRides() {
    const ongoingRides = await this.rideService.getAll(RideStatuses.ONGOING);

    return JsonResponse.create(
      'Ongoing rides retrieved successfully.',
      ongoingRides,
    );
  }

  @Post(':rideId/stop')
  @HttpCode(200)
  async stop(@Param('rideId') rideId: string) {
    try {
      const stoppedRide = await this.rideService.stop(rideId);

      if (!stoppedRide) {
        throw new BadRequestException('Invalid ride selected.');
      }

      return JsonResponse.create('Ride stopped successfully.', stoppedRide);
    } catch (error) {
      if (error instanceof CannotStopRideError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @Post(':passengerId/:driverId')
  async create(
    @Param() params,
    @Body(new ValidationPipe()) createRideDto: CreateRideDto,
  ) {
    const passenger = await this.passengerService.getById(params.passengerId);

    if (!passenger) {
      throw new BadRequestException('Invalid passenger provided.');
    }

    const driver = await this.driverService.getById(params.driverId);

    if (!driver) {
      throw new BadRequestException('Invalid driver provided.');
    }

    try {
      const createdRide = await this.rideService.create(
        driver,
        passenger,
        createRideDto,
      );

      return JsonResponse.create('Ride created successfully.', createdRide);
    } catch (error) {
      if (error instanceof CannotCreateRideError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
