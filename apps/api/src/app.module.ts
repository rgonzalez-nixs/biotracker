import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { BiomarkersModule } from './biomarkers/biomarkers.module';

@Module({
  imports: [PatientsModule, BiomarkersModule],
})
export class AppModule {}
