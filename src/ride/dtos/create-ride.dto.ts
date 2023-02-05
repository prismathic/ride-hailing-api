import { IsLatLong } from 'class-validator';

export class CreateRideDto {
  @IsLatLong()
  pickupPoint: string;

  @IsLatLong()
  destinationPoint: string;
}
