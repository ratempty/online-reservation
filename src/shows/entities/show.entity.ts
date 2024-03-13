import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  info: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  space: string;

  @Column({ type: 'date', nullable: false })
  dateTime: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.show)
  reservation: Reservation[];

  @OneToMany(() => Seat, (seat) => seat.show)
  seat: Seat[];
}
