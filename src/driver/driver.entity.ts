import { Ride } from 'src/ride/ride.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'datetime', default: null })
  suspendedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ride, (ride) => ride.driver)
  rides: Ride[];
}
