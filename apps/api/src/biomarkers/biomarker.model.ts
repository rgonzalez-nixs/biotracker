export interface Biomarker {
  id: number;
  patientId: number;
  name: string;
  value: number;
  unit: string;
  category: string;
  referenceRange: {
    min: number;
    max: number;
  };
  measuredAt: string;
  status: 'normal' | 'high' | 'low';
}
