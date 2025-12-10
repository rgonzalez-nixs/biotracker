import { Module } from '@nestjs/common';
import { BiomarkersController } from './biomarkers.controller';
import { BiomarkersService } from './biomarkers.service';
import { BiomarkersSchedulerService } from './biomarkers-scheduler.service';

@Module({
  controllers: [BiomarkersController],
  providers: [BiomarkersService, BiomarkersSchedulerService],
})
export class BiomarkersModule {}
