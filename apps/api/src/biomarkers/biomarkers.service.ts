import { Injectable } from '@nestjs/common';
import { Biomarker } from './biomarker.model';

type Template = Omit<
  Biomarker,
  'id' | 'patientId' | 'value' | 'status' | 'measuredAt'
>;

@Injectable()
export class BiomarkersService {
  // In-memory seed data for demo purposes: 5 patients x 15 biomarkers each
  private readonly biomarkers: Biomarker[] = this.buildBiomarkers();

  private buildBiomarkers(): Biomarker[] {
    const templates: Template[] = [
      {
        name: 'Glucose (fasting)',
        unit: 'mg/dL',
        category: 'metabolic',
        referenceRange: { min: 70, max: 99 },
      },
      {
        name: 'HbA1c',
        unit: '%',
        category: 'metabolic',
        referenceRange: { min: 4, max: 5.6 },
      },
      {
        name: 'Triglycerides',
        unit: 'mg/dL',
        category: 'metabolic',
        referenceRange: { min: 0, max: 150 },
      },
      {
        name: 'Insulin',
        unit: 'µIU/mL',
        category: 'metabolic',
        referenceRange: { min: 2, max: 25 },
      },
      {
        name: 'Creatinine',
        unit: 'mg/dL',
        category: 'metabolic',
        referenceRange: { min: 0.7, max: 1.3 },
      },
      {
        name: 'Total Cholesterol',
        unit: 'mg/dL',
        category: 'cardiovascular',
        referenceRange: { min: 0, max: 200 },
      },
      {
        name: 'LDL Cholesterol',
        unit: 'mg/dL',
        category: 'cardiovascular',
        referenceRange: { min: 0, max: 130 },
      },
      {
        name: 'HDL Cholesterol',
        unit: 'mg/dL',
        category: 'cardiovascular',
        referenceRange: { min: 40, max: 60 },
      },
      {
        name: 'Systolic BP',
        unit: 'mmHg',
        category: 'cardiovascular',
        referenceRange: { min: 90, max: 120 },
      },
      {
        name: 'Diastolic BP',
        unit: 'mmHg',
        category: 'cardiovascular',
        referenceRange: { min: 60, max: 80 },
      },
      {
        name: 'TSH',
        unit: 'µIU/mL',
        category: 'hormonal',
        referenceRange: { min: 0.4, max: 4.0 },
      },
      {
        name: 'Free T4',
        unit: 'ng/dL',
        category: 'hormonal',
        referenceRange: { min: 0.8, max: 1.8 },
      },
      {
        name: 'Cortisol (AM)',
        unit: 'µg/dL',
        category: 'hormonal',
        referenceRange: { min: 6, max: 23 },
      },
      {
        name: 'Testosterone',
        unit: 'ng/dL',
        category: 'hormonal',
        referenceRange: { min: 300, max: 1000 },
      },
      {
        name: 'Estradiol',
        unit: 'pg/mL',
        category: 'hormonal',
        referenceRange: { min: 20, max: 200 },
      },
    ];

    const biomarkers: Biomarker[] = [];
    let id = 100;

    for (let patientId = 1; patientId <= 5; patientId += 1) {
      templates.forEach((template, idx) => {
        const rangeMid =
          (template.referenceRange.min + template.referenceRange.max) / 2;
        const variance = (idx % 3) * 0.05 * (rangeMid || 1); // small spread by template
        const direction = patientId % 3 === 0 ? -1 : 1;
        const value = Number((rangeMid + direction * variance).toFixed(2));

        const status =
          value < template.referenceRange.min
            ? 'low'
            : value > template.referenceRange.max
              ? 'high'
              : 'normal';

        biomarkers.push({
          id: ++id,
          patientId,
          name: template.name,
          value,
          unit: template.unit,
          category: template.category,
          referenceRange: template.referenceRange,
          measuredAt: `2025-11-${String((patientId % 5) + 1).padStart(2, '0')}T09:00:00Z`,
          status,
        });
      });
    }

    return biomarkers;
  }

  getBiomarkers(patientId: number, category?: string): Biomarker[] {
    const scoped = this.biomarkers.filter((bio) => bio.patientId === patientId);

    if (!category) {
      return scoped;
    }

    return scoped.filter(
      (bio) => bio.category.toLowerCase() === category.toLowerCase(),
    );
  }
}
