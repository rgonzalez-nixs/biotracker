import { Injectable } from '@nestjs/common';
import { Patient } from './patient.model';

@Injectable()
export class PatientsService {
  // In-memory seed data for demo purposes
  private readonly patients: Patient[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      dateOfBirth: '1988-02-14',
      lastVisit: '2025-11-02',
    },
    {
      id: 2,
      name: 'Priya Desai',
      dateOfBirth: '1992-06-01',
      lastVisit: '2025-10-21',
    },
    {
      id: 3,
      name: 'Marco Silva',
      dateOfBirth: '1985-09-12',
      lastVisit: '2025-11-15',
    },
    {
      id: 4,
      name: 'Sofia Martinez',
      dateOfBirth: '1979-04-28',
      lastVisit: '2025-11-08',
    },
    {
      id: 5,
      name: 'Taylor Nguyen',
      dateOfBirth: '1995-12-05',
      lastVisit: '2025-10-30',
    },
  ];

  getPatient(id: number): Patient | undefined {
    return this.patients.find((patient) => patient.id === id);
  }

  getPatients(): Patient[] {
    return this.patients;
  }
}
