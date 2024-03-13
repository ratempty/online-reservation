import { Show } from 'src/shows/entities/show.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Seat',
})
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  canBook: boolean;

  @Column({ type: 'varchar', nullable: false })
  seatNum: string;

  @ManyToOne(() => Show, (show) => show.seat)
  @JoinColumn({ name: 'showId' })
  show: Show;

  @Column('int', { name: 'showId', select: true, nullable: false })
  showId: number;
}
