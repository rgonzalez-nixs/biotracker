import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PatientsModule } from './patients/patients.module';
import { BiotrackersModule } from './biotrackers/biotracker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(), PatientsModule, BiotrackersModule],
})
export class AppModule {}
