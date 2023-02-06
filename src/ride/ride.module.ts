import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './ride.entity';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ride]), DriverModule, PassengerModule],
  providers: [RideService],
  controllers: [RideController],
})
export class RideModule {}
