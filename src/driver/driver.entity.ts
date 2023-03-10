import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Ride } from '../ride/ride.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isSuspended: boolean;

  @Column({ type: 'datetime', default: null })
  suspendedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ride, (ride) => ride.driver)
  rides: Ride[];
}
