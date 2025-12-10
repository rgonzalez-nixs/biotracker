import { Module } from '@nestjs/common';
import { BiomarkersController } from './biomarkers.controller';
import { BiomarkersService } from './biomarkers.service';

@Module({
  controllers: [BiomarkersController],
  providers: [BiomarkersService],
})
export class BiomarkersModule {}
