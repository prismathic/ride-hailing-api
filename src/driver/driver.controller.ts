import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDriverDto } from './create-driver.dto';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Get('')
  async index() {
    return await this.driverService.getAll();
  }

  @Post('')
  async create(
    @Request() req,
    @Body(new ValidationPipe()) createDriverDto: CreateDriverDto,
  ) {
    return await this.driverService.create(createDriverDto);
  }

  @Post(':id/suspend')
  @HttpCode(204)
  async suspend(@Param('id') id: string) {
    const driver = await this.driverService.getById(id);

    if (!driver) {
      throw new BadRequestException('Driver does not exist');
    }

    if (driver.suspendedAt) {
      throw new BadRequestException(
        'The selected driver has already been suspended.',
      );
    }

    return await this.driverService.suspend(driver.id);
  }

  @Delete(':id/suspend')
  @HttpCode(204)
  async unsuspend(@Param('id') id: string) {
    const driver = await this.driverService.getById(id);

    if (!driver) {
      throw new BadRequestException('Driver does not exist');
    }

    if (!driver.suspendedAt) {
      throw new BadRequestException(
        'The selected driver is not under suspension.',
      );
    }

    return await this.driverService.unsuspend(driver.id);
  }
}
