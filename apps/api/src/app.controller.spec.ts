import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients/patients.controller';
import { PatientsService } from './patients/patients.service';
import { BiomarkersController } from './biomarkers/biomarkers.controller';
import { BiomarkersService } from './biomarkers/biomarkers.service';

describe('API controllers', () => {
  let patientsController: PatientsController;
  let biomarkersController: BiomarkersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController, BiomarkersController],
      providers: [PatientsService, BiomarkersService],
    }).compile();

    patientsController = app.get<PatientsController>(PatientsController);
    biomarkersController = app.get<BiomarkersController>(BiomarkersController);
  });

  it('returns 5 seeded patients', () => {
    const patients = patientsController.getPatients();
    expect(patients).toHaveLength(5);
  });

  it('returns 15 biomarkers for a patient', () => {
    const biomarkers = biomarkersController.getBiomarkers(1);
    expect(biomarkers).toHaveLength(15);
    expect(biomarkers.every((b) => b.patientId === 1)).toBe(true);
  });

  it('filters biomarkers by category', () => {
    const biomarkers = biomarkersController.getBiomarkers(1, 'metabolic');
    expect(biomarkers.every((b) => b.category === 'metabolic')).toBe(true);
    expect(biomarkers).toHaveLength(5);
  });
});
