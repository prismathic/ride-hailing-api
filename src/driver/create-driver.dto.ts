import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  name: string;

  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
