const API = `htpps://{import.meta.env.VITE_API_PORT}${import.meta.env.VITE_BE_URL}`;
const MCP = `htpps://${import.meta.env.VITE_MCP_PORT}${import.meta.env.VITE_BE_URL}`;

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

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${API}/api/patients`);
  console.log({response});
  
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
}

export async function getPatient(id: number): Promise<Patient | undefined> {
  const response = await fetch(`${API}/api/patients/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
}

export async function getBiomarkers(patientId: number): Promise<Biomarker[]> {
  const response = await fetch(`${API}/api/patients/${patientId}/biomarkers`);  
  if (!response.ok) {
    throw new Error('Failed to fetch biomarkers');
  }
  return response.json();
}

export async function getAiInsights(patientId: number, patientName: string, biomarkers: Biomarker[])  {
  const analysisPromise = fetch(`${MCP}/mcp/analize-biomarkers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, patientName, biomarkers }),
  });
  const suggestionsPromise = fetch(`${MCP}/mcp/analize-biomarkers`, {
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

  const [analysisResponse, suggestionsResponse] = await Promise.all(responses.map((response) => response.json()));

  return {
    analysis: analysisResponse as { text: string; raw: { content: { type: 'text'; text: string }[] }, success: boolean },
    suggestions: suggestionsResponse as { text: string; raw: { content: { type: 'text'; text: string }[] }, success: boolean },
  };
}
