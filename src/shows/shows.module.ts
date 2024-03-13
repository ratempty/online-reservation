import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { SeatsModule } from 'src/seats/seats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show]), SeatsModule],
  controllers: [ShowsController],
  providers: [ShowsService],
  exports: [TypeOrmModule.forFeature([Show])],
})
export class ShowsModule {}
