import { Ride } from 'src/ride/ride.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

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
