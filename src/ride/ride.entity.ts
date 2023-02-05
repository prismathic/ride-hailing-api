import { Driver } from 'src/driver/driver.entity';
import { Passenger } from 'src/passenger/passenger.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export enum RideStatuses {
  ONGOING = 'ongoing',
  DONE = 'done',
}

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver, (driver) => driver.rides)
  driver: Driver;

  @ManyToOne(() => Passenger, (passenger) => passenger.rides)
  passenger: Passenger;

  @Column()
  status: RideStatuses;

  @Column()
  pickupPoint: string;

  @Column()
  destinationPoint: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
