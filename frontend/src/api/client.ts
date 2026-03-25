const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json();
}

export interface Player {
  id?: number;
  name: string;
  jerseyNumber: number;
  position: string;
  age: number;
  nationality: string;
  salary: number;
  status: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'ON_LOAN' | 'RETIRED';
  joinDate: string;
  phone?: string;
  email?: string;
}

export interface TrainingSession {
  id?: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'TEAM' | 'INDIVIDUAL' | 'TACTICAL' | 'PHYSICAL' | 'RECOVERY' | 'MATCH_PREP';
  description: string;
  participantIds?: string;
}

export interface Finance {
  id?: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
  relatedPlayerName?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export const playerApi = {
  getAll: () => request<Player[]>('/api/players'),
  get: (id: number) => request<Player>(`/api/players/${id}`),
  create: (data: Player) => request<Player>('/api/players', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Player) => request<Player>(`/api/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/players/${id}`, { method: 'DELETE' }),
  count: () => request<number>('/api/players/count'),
};

export const trainingApi = {
  getAll: () => request<TrainingSession[]>('/api/trainings'),
  get: (id: number) => request<TrainingSession>(`/api/trainings/${id}`),
  create: (data: TrainingSession) => request<TrainingSession>('/api/trainings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TrainingSession) => request<TrainingSession>(`/api/trainings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/trainings/${id}`, { method: 'DELETE' }),
  upcoming: () => request<TrainingSession[]>('/api/trainings/upcoming'),
};

export const financeApi = {
  getAll: () => request<Finance[]>('/api/finances'),
  get: (id: number) => request<Finance>(`/api/finances/${id}`),
  create: (data: Finance) => request<Finance>('/api/finances', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Finance) => request<Finance>(`/api/finances/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/finances/${id}`, { method: 'DELETE' }),
  summary: () => request<FinanceSummary>('/api/finances/summary'),
};
