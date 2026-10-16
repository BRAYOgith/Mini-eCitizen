import { ServiceRequest, ApplicationStatus, OfficerReviewRecord, OfficerAccount } from '@/types';

const STORAGE_KEY = 'mini_ecitizen_requests_v2';
const OFFICER_SESSION_KEY = 'mini_ecitizen_officer_session';

export function getStoredRequests(): ServiceRequest[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
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
    console.error('Storage write error', e);
  }
}

export function createNewRequest(newRequest: ServiceRequest): ServiceRequest[] {
  const current = getStoredRequests();
  const updated = [newRequest, ...current];
  saveStoredRequests(updated);
  return updated;
}

export function updateRequestReview(
  id: string,
  newStatus: ApplicationStatus,
  reviewRecord: OfficerReviewRecord,
  certificateData?: ServiceRequest['certificate']
): ServiceRequest[] {
  const current = getStoredRequests();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        reviewRecord,
        ...(certificateData ? { certificate: certificateData } : {})
      };
    }
    return item;
  });
  saveStoredRequests(updated);
  return updated;
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

export function clearDatabase(): ServiceRequest[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem('mini_ecitizen_requests_v1');
  }
  return [];
}
