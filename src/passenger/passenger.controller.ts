import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonResponse } from 'src/common/helpers/json-response.helper';
import { CreateDriverDto } from 'src/driver/create-driver.dto';
import { CannotCreatePassengerError } from './errors/cannot-create-passenger.error';
import { PassengerService } from './passenger.service';

@UseGuards(AuthGuard('jwt'))
@Controller('passenger')
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @Get('')
  async index() {
    const passengers = await this.passengerService.getAll();

    return JsonResponse.create(
      'Passengers retrieved successfully.',
      passengers,
    );
  }

  @Post('')
  async create(
    @Request() req,
    @Body(new ValidationPipe()) createPassengerDto: CreateDriverDto,
  ) {
    try {
      const newPassenger = await this.passengerService.create(
        createPassengerDto,
      );

      return JsonResponse.create(
        'Passenger created successfully.',
        newPassenger,
      );
    } catch (error) {
      if (error instanceof CannotCreatePassengerError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const passenger = await this.passengerService.getById(id);

    return JsonResponse.create('Passenger retrieved successfully.', passenger);
  }
}
