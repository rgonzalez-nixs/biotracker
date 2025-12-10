import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PatientsModule } from './patients/patients.module';
import { BiomarkersModule } from './biomarkers/biomarkers.module';

@Module({
  imports: [ScheduleModule.forRoot(), PatientsModule, BiomarkersModule],
})
export class AppModule {}
