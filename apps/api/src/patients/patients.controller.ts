import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patient.model';

@Controller('api/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients(): Patient[] {
    return this.patientsService.getPatients();
  }

  @Get(':id')
  getPatient(@Param('id', ParseIntPipe) id: number): Patient | undefined {
    return this.patientsService.getPatient(id);
  }
}
