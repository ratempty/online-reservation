import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ShowsModule } from 'src/shows/shows.module';
import { SeatsModule } from 'src/seats/seats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from 'src/users/users.module';
import { PointsModule } from 'src/points/points.module';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
  imports: [
    ShowsModule,
    SeatsModule,
    UserModule,
    PointsModule,
    TypeOrmModule.forFeature([Reservation]),
  ],
})
export class ReservationsModule {}
