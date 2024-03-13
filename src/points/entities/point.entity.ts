import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Point',
})
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('int', { name: 'userId', select: true, nullable: false })
  userId: number;

  @Column({ type: 'int', name: 'point', default: 100000 })
  point: number;
}
