import {
  ServiceRequest,
  RequestStatus,
  AdminResolution,
  OfficerAccount,
  CitizenAccount,
  AnalyticsSummary,
  ServiceCategory
} from '@/types';

const STORAGE_KEY = 'mini_ecitizen_civic_requests_v6';
const OFFICER_SESSION_KEY = 'mini_ecitizen_officer_session';
const CITIZEN_SESSION_KEY = 'mini_ecitizen_citizen_session';
const CITIZENS_DB_KEY = 'mini_ecitizen_citizens_db';
const OFFICERS_DB_KEY = 'mini_ecitizen_officers_db';

export function getStoredRequests(): ServiceRequest[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    localStorage.removeItem('mini_ecitizen_public_requests_v3');
    localStorage.removeItem('mini_ecitizen_requests_v2');
    localStorage.removeItem('mini_ecitizen_requests_v1');
    localStorage.removeItem('mini_ecitizen_requests');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const filtered = parsed.filter(item => {
        if (!item || !item.id) return false;
        if (typeof item.id === 'string' && item.id.startsWith('req-sample')) return false;
        if (typeof item.referenceNumber === 'string' && (item.referenceNumber.includes('1042') || item.referenceNumber.includes('2051'))) return false;
        return true;
      });
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      return filtered;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

export function saveStoredRequests(requests: ServiceRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function createNewRequest(newRequest: ServiceRequest): ServiceRequest[] {
  const current = getStoredRequests();
  const updated = [newRequest, ...current];
  saveStoredRequests(updated);
  return updated;
}

export function updateRequestStatus(
  id: string,
  newStatus: RequestStatus,
  resolution: AdminResolution
): ServiceRequest[] {
  const current = getStoredRequests();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        adminFeedback: resolution
      };
    }
    return item;
  });
  saveStoredRequests(updated);
  return updated;
}

export function deleteRequest(id: string): ServiceRequest[] {
  const current = getStoredRequests();
  const updated = current.filter(item => item.id !== id);
  saveStoredRequests(updated);
  return updated;
}

export function calculateAnalytics(requests: ServiceRequest[]): AnalyticsSummary {
  const totalRequests = requests.length;
  const openCases = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCases = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const resolvedCases = requests.filter(r => r.status === 'RESOLVED').length;

  const resolutionRate =
    totalRequests > 0 ? Math.round((resolvedCases / totalRequests) * 100) : 0;

  const categoryCounts: Record<ServiceCategory, number> = {
    STREETLIGHT: 0,
    WATER: 0,
    GARBAGE: 0,
    ROAD: 0,
    SEWERAGE: 0,
    PUBLIC_HEALTH: 0,
    OTHER: 0
  };

  requests.forEach(r => {
    if (categoryCounts[r.category] !== undefined) {
      categoryCounts[r.category] += 1;
    } else {
      categoryCounts.OTHER += 1;
    }
  });

  return {
    totalRequests,
    openCases,
    inProgressCases,
    resolvedCases,
    resolutionRate,
    categoryCounts
  };
}

export function getStoredOfficerSession(): OfficerAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(OFFICER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredOfficerSession(officer: OfficerAccount | null): void {
  if (typeof window === 'undefined') return;
  if (!officer) {
    localStorage.removeItem(OFFICER_SESSION_KEY);
  } else {
    localStorage.setItem(OFFICER_SESSION_KEY, JSON.stringify(officer));
  }
}

export function getStoredCitizenSession(): CitizenAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CITIZEN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredCitizenSession(citizen: CitizenAccount | null): void {
  if (typeof window === 'undefined') return;
  if (!citizen) {
    localStorage.removeItem(CITIZEN_SESSION_KEY);
  } else {
    localStorage.setItem(CITIZEN_SESSION_KEY, JSON.stringify(citizen));
  }
}

export function getRegisteredCitizens(): CitizenAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CITIZENS_DB_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegisteredCitizen(account: CitizenAccount): void {
  if (typeof window === 'undefined') return;
  const list = getRegisteredCitizens();
  const existingIdx = list.findIndex(c => c.nationalId === account.nationalId || c.email === account.email);
  if (existingIdx >= 0) {
    list[existingIdx] = account;
  } else {
    list.push(account);
  }
  localStorage.setItem(CITIZENS_DB_KEY, JSON.stringify(list));
}

export function getRegisteredOfficers(): OfficerAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFICERS_DB_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegisteredOfficer(officer: OfficerAccount): void {
  if (typeof window === 'undefined') return;
  const list = getRegisteredOfficers();
  const existingIdx = list.findIndex(o => o.badgeNumber.toLowerCase() === officer.badgeNumber.toLowerCase() || o.email.toLowerCase() === officer.email.toLowerCase());
  if (existingIdx >= 0) {
    list[existingIdx] = officer;
  } else {
    list.push(officer);
  }
  localStorage.setItem(OFFICERS_DB_KEY, JSON.stringify(list));
}
