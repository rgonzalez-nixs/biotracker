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
  if (!response.ok) {
    throw new Error('Failed to fetch biomarkers');
  }
  return response.json();
}

const MCP_BASE_URL = 'http://localhost:3030';

export async function getAiInsights(patientId: number, patientName: string, biomarkers: Biomarker[])  {
  const analysisPromise = fetch(`${MCP_BASE_URL}/mcp/analize-biomarkers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, patientName, biomarkers }),
  });
  const suggestionsPromise = fetch(`${MCP_BASE_URL}/mcp/analize-biomarkers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, patientName, biomarkers }),
  });

  const responses = await Promise.all([analysisPromise, suggestionsPromise]);
  console.log('fired');
  
  if (!responses.every((response) => response.ok)) {
    throw new Error('Failed to fetch biomarkers');
  }

  const jsonResponses = await Promise.all(responses.map((response) => response.json()));
  console.log({patientId, patientName, biomarkers, jsonResponses});
  
  return jsonResponses.map((response) => ({
    analysis: response.analysis,
    suggestions: response.suggestions,
  }));
}
