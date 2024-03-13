import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { Seat } from 'src/seats/entities/seat.entity';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,

    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async create(
    title: string,
    info: string,
    price: number,
    space: string,
    dateTime: string,
  ) {
    const show = await this.showRepository.save({
      title,
      info,
      price,
      space,
      dateTime,
    });

    const seatArr = [];
    let arr = ['A', 'B', 'C'];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 1; j <= arr.length; j++) {
        seatArr.push(`${arr[i]}-${j}`);
      }
    }

    seatArr.forEach((item) => {
      this.seatRepository.save({
        showId: show.id,
        seatNum: item,
      });
    });
  }

  async findAll() {
    return await this.showRepository.find({
      select: ['id', 'title'],
    });
  }

  async findOne(id: number) {
    return await this.verifyshowById(id);
  }

  private async verifyshowById(id: number) {
    const show = await this.showRepository.findOneBy({ id });
    if (_.isNil(show)) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }

    return show;
  }

  async findAllByTitle(title: string) {
    const shows = await this.showRepository.find({
      where: { title: title },
    });

    return shows;
  }
}
