import { Controller, Get } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patient.model';

@Controller('api/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients(): Patient[] {
    return this.patientsService.getPatients();
  }
}
