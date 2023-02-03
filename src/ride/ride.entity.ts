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
  STOPPED = 'stopped',
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

  //   @Column('point')
  //   pickup_point: string;

  //   @Column('point')
  //   destination_point: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
