import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDriverDto } from 'src/driver/create-driver.dto';
import { PassengerService } from './passenger.service';

@Controller('passenger')
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @Get('')
  async index() {
    return await this.passengerService.getAll();
  }

  @Post('')
  async create(
    @Request() req,
    @Body(new ValidationPipe()) createPassengerDto: CreateDriverDto,
  ) {
    return await this.passengerService.create(createPassengerDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.passengerService.getById(id);
  }
}
