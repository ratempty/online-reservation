import { Show } from 'src/shows/entities/show.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'dateTime' })
  dateTime: Date;

  @ManyToOne(() => Show, (show) => show.reservation)
  @JoinColumn({ name: 'showId' })
  show: Show;

  @Column('int', { name: 'showId', select: true, nullable: false })
  showId: number;

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('int', { name: 'userId', select: true, nullable: false })
  userId: number;

  @Column({ type: 'int', name: 'person' })
  person: number;

  @Column({ type: 'varchar', name: 'seat' })
  seat: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;
}
