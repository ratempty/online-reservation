import { Point } from 'src/points/entities/point.entity';
import {
  AfterInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  getManager,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];
}
