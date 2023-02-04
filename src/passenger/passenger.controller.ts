import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponse } from 'src/common/helpers/json-response.helper';
import { CreateDriverDto } from 'src/driver/create-driver.dto';
import { PassengerService } from './passenger.service';

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
    const newPassenger = await this.passengerService.create(createPassengerDto);

    return JsonResponse.create('Passenger created successfully.', newPassenger);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const passenger = await this.passengerService.getById(id);

    return JsonResponse.create('Passenger retrieved successfully.', passenger);
  }
}
