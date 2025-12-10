const mode = import.meta.env.MODE;
const API = mode === 'development'
  ? `${import.meta.env.VITE_BE_URL}:${import.meta.env.VITE_API_PORT}`
  : `https://${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_BE_URL}`;
const MCP = mode === 'development'
  ? `${import.meta.env.VITE_BE_URL}:${import.meta.env.VITE_MCP_PORT}`
  : `https://${import.meta.env.VITE_MCP_PORT}${import.meta.env.VITE_BE_URL}`;

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  lastVisit: string;
}

export interface Biotracker {
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

export async function getBiotrackers(patientId: number): Promise<Biotracker[]> {
  const response = await fetch(`${API}/api/patients/${patientId}/biotrackers`);
  if (!response.ok) {
    throw new Error('Failed to fetch biotrackers');
  }
  return response.json();
}

export async function getAiInsights(patientId: number, patientName: string, biotrackers: Biotracker[]) {
  const analysisPromise = fetch(`${MCP}/mcp/analize-biotrackers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, patientName, biotrackers }),
  });
  const suggestionsPromise = fetch(`${MCP}/mcp/analize-biotrackers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, patientName, biotrackers }),
  });

  const responses = await Promise.all([analysisPromise, suggestionsPromise]);
  if (!responses.every((response) => response.ok)) {
    throw new Error('Failed to fetch biotrackers');
  }

  const [analysisResponse, suggestionsResponse] = await Promise.all(responses.map((response) => response.json()));

  return {
    analysis: analysisResponse as { text: string; raw: { content: { type: 'text'; text: string }[] }, success: boolean },
    suggestions: suggestionsResponse as { text: string; raw: { content: { type: 'text'; text: string }[] }, success: boolean },
  };
}
