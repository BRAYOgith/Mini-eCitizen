export type ServiceAgency = 'DCI' | 'NTSA' | 'BRS' | 'CRS' | 'IMMIGRATION';

export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'ISSUED';

export interface PublicService {
  id: string;
  code: ServiceAgency;
  name: string;
  agencyName: string;
  category: string;
  statutoryFee: number;
  processingTimeDays: number;
  description: string;
  requirements: string[];
  serviceSpecificFields: ServiceFieldDefinition[];
  requiredDocumentName: string;
  logoUrl: string;
}

export interface ServiceFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
  required: boolean;
}

export interface CitizenBiodata {
  nationalId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  county: string;
  subCounty: string;
  dateOfBirth: string;
}

export interface OfficerAccount {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
}

export interface OfficerReviewRecord {
  reviewedAt: string;
  officerId: string;
  officerName: string;
  notes: string;
  decision: ApplicationStatus;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  serviceId: string;
  serviceName: string;
  agencyCode: ServiceAgency;
  statutoryFee: number;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  applicant: CitizenBiodata;
  serviceData: Record<string, string>;
  documentName?: string;
  documentDataUrl?: string;
  reviewRecord?: OfficerReviewRecord;
  certificate?: {
    certificateNumber: string;
    issuedAt: string;
    expiresAt?: string;
    securityChecksum: string;
  };
}

export interface VerificationLookupResult {
  found: boolean;
  tamperProofVerified: boolean;
  request?: ServiceRequest;
  message: string;
}
