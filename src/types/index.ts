export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type ServiceCategory =
  | 'STREETLIGHT'
  | 'WATER'
  | 'GARBAGE'
  | 'ROAD'
  | 'SEWERAGE'
  | 'PUBLIC_HEALTH'
  | 'OTHER';

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface CitizenAccount {
  id: string;
  nationalId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  county: string;
  password?: string;
}

export interface OfficerAccount {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  password?: string;
}

export interface RequestLocation {
  county: string;
  subCounty: string;
  ward: string;
  streetOrLandmark: string;
}

export interface AdminResolution {
  officerName: string;
  officerBadge: string;
  updatedStatus: RequestStatus;
  notes: string;
  resolvedAt?: string;
  assignedTeam?: string;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  category: ServiceCategory;
  categoryLabel: string;
  title: string;
  description: string;
  location: RequestLocation;
  priority: RequestPriority;
  imageUrl?: string;
  imageName?: string;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
  applicant: {
    fullName: string;
    nationalId: string;
    email: string;
    phoneNumber: string;
  };
  adminFeedback?: AdminResolution;
}

export interface CategoryDefinition {
  id: ServiceCategory;
  label: string;
  description: string;
  department: string;
  iconName: string;
  estimatedResolutionDays: number;
}

export interface PublicService {
  id: string;
  name: string;
  code: string;
  agencyName: string;
  agencyCode: string;
  description: string;
  category: ServiceCategory;
  categoryLabel?: string;
  iconName: string;
  statutoryFee?: number;
  processingDays?: number;
  logoUrl?: string;
}

export interface AnalyticsSummary {
  totalRequests: number;
  openCases: number;
  inProgressCases: number;
  resolvedCases: number;
  resolutionRate: number;
  categoryCounts: Record<ServiceCategory, number>;
}
