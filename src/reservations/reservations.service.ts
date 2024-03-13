import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Show } from 'src/shows/entities/show.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,

    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,

    private dataSource: DataSource,
  ) {}

  async create(showId: number, seatNum: any, userId: number) {
    let canSeat = [];
    for (let i = 0; i < seatNum.seats.length; i++) {
      let findSeat = await this.seatRepository.find({
        where: {
          showId: showId,
          seatNum: seatNum.seats[i],
        },
      });
      if (findSeat[0].canBook) {
        canSeat.push(findSeat[0]);
      }
    }

    if (canSeat.length !== seatNum.seats.length) {
      return;
    }
    const findShow = await this.showRepository.find({
      where: { id: showId },
    });
    // 보유포인트 부족한지 확인
    const nowPoint = await this.pointRepository
      .createQueryBuilder('point')
      .select('SUM(point.point)', 'Point')
      .where('point.userId = :userId', { userId })
      .getRawOne();

    if (nowPoint.Point < findShow[0].price) {
      throw new Error('보유 포인트 부족!');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Point).save({
        userId: userId,
        point: -findShow[0].price * canSeat.length,
      });

      let reservation = [];
      for (let i = 0; i < seatNum.seats.length; i++) {
        let createReserve = await queryRunner.manager
          .getRepository(Reservation)
          .save({
            showId: showId,
            title: findShow[0].title,
            dateTime: findShow[0].dateTime,
            userId: userId,
            person: seatNum.length,
            seat: seatNum.seats[i],
          });

        let updateSeat = await queryRunner.manager.getRepository(Seat).update(
          {
            showId: showId,
            seatNum: seatNum.seats[i],
          },
          { canBook: false },
        );
        reservation.push(createReserve);
      }

      await queryRunner.commitTransaction();
      return reservation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release(); // == commit
    }
  }

  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async find(showId: number, userId: number) {
    return await this.reservationRepository.find({
      where: {
        userId: userId,
        showId: showId,
      },
    });
  }

  async delete(showId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(Reservation).delete({
        userId: userId,
        showId: showId,
      });

      const findReserve = await this.find(showId, userId);

      const findShow = await this.showRepository.find({
        where: { id: showId },
      });

      const savePoint = await queryRunner.manager.getRepository(Point).save({
        userId: userId,
        point: findShow[0].price * findReserve.length,
      });

      for (let i = 0; i < findReserve.length; i++) {
        const updateSeat = await queryRunner.manager.getRepository(Seat).update(
          {
            seatNum: findReserve[i].seat,
          },
          {
            canBook: true,
          },
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
