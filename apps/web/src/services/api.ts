export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  lastVisit: string;
}

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

const API_BASE_URL = 'http://localhost:3000';

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${API_BASE_URL}/api/patients`);
  console.log({response});
  
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
}

export async function getPatient(id: number): Promise<Patient | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/patients/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
}

export async function getBiomarkers(patientId: number): Promise<Biomarker[]> {
  const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}/biomarkers`);
  console.log('fired');
  
  if (!response.ok) {
    throw new Error('Failed to fetch biomarkers');
  }
  return response.json();
}
