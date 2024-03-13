import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/types/userRole.type';
import { Roles } from 'src/auth/roles.decorator';
import { ShowDto } from './dto/show.dto';

@UseGuards(RolesGuard)
@Controller('show')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() showDto: ShowDto) {
    await this.showsService.create(
      showDto.title,
      showDto.info,
      showDto.price,
      showDto.space,
      showDto.dateTime,
    );
  }

  @Get()
  async findAll(@Query('title') title: string) {
    if (title) {
      return await this.showsService.findAllByTitle(title);
    }
    return await this.showsService.findAll();
  }

  @Get(':showId')
  async findOne(@Param('showId') showId: number) {
    return await this.showsService.findOne(showId);
  }
}
