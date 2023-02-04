import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengerService],
  controllers: [PassengerController],
  exports: [PassengerService],
})
export class PassengerModule {}
