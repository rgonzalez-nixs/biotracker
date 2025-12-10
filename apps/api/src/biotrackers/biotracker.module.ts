import { Module } from '@nestjs/common';
import { BiotrackersController } from './biotracker.controller';
import { BiotrackersService } from './biotracker.service';
import { BiotrackersSchedulerService } from './biotracker-scheduler.service';

@Module({
  controllers: [BiotrackersController],
  providers: [BiotrackersService, BiotrackersSchedulerService],
})
export class BiotrackersModule {}
