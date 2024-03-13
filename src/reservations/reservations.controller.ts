import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types/userRole.type';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'))
  @Post('/:showId')
  async create(
    @Param('showId') showId: number,
    @Body() seatNum: any,
    @UserInfo() user: User,
  ) {
    const reserve = await this.reservationsService.create(
      showId,
      seatNum,
      user.id,
    );
    if (reserve) {
      return { message: '예약 완료 되었습니다.', reserve };
    } else {
      return { message: '예약 실패 !' };
    }
  }

  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserInfo() user: User) {
    return await this.reservationsService.findAll(user.id);
  }

  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'))
  @Get(':showId')
  async find(@Param('showId') showId: number, @UserInfo() user: User) {
    return await this.reservationsService.find(showId, user.id);
  }

  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':showId')
  async delete(@Param('showId') showId: number, @UserInfo() user: User) {
    const deleteResereve = await this.reservationsService.delete(
      showId,
      user.id,
    );
  }
}
