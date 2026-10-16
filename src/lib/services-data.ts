import { PublicService } from '@/types';

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export const OFFICIAL_SERVICES: PublicService[] = [
  {
    id: 'dci-good-conduct',
    code: 'DCI',
    name: 'Police Clearance Certificate (Good Conduct)',
    agencyName: 'Directorate of Criminal Investigations (DCI)',
    category: 'Law Enforcement & Judiciary',
    statutoryFee: 1050,
    processingTimeDays: 7,
    logoUrl: '/logos/dci.png',
    description: 'Statutory vetting and issuance of electronic police clearance certificate confirming absence of criminal conviction records.',
    requirements: [
      'Original Kenyan National Identity Card',
      'Recent clear passport-size colored photograph',
      'Designated fingerprint booking station',
      'Applicable statutory processing fee (KES 1,050)'
    ],
    requiredDocumentName: 'Fingerprint Card or Passport Photo',
    serviceSpecificFields: [
      {
        id: 'fingerprintStation',
        label: 'Preferred Fingerprint Booking Station',
        type: 'select',
        options: ['DCI Headquarters (Mazingira House, Nairobi)', 'Huduma Centre GPO Nairobi', 'Huduma Centre Mombasa', 'Huduma Centre Kisumu', 'Huduma Centre Nakuru', 'Huduma Centre Eldoret', 'Huduma Centre Nyeri'],
        required: true
      },
      {
        id: 'purposeOfCertificate',
        label: 'Purpose of Certificate',
        type: 'select',
        options: ['Employment Clearance', 'Public Service Board Appointment', 'Immigration / Visa Application', 'Tender & Public Procurement Compliance', 'Academic Institution Admission'],
        required: true
      }
    ]
  },
  {
    id: 'ntsa-driving-license',
    code: 'NTSA',
    name: 'Smart Driving License Application & Renewal',
    agencyName: 'National Transport and Safety Authority (NTSA)',
    category: 'Transport & Motoring',
    statutoryFee: 3050,
    processingTimeDays: 5,
    logoUrl: '/logos/ntsa.png',
    description: 'Issuance and renewal of biometric digital Smart Driving License equipped with electronic chip and point-demerit security.',
    requirements: [
      'National Identity Card',
      'Certified Medical & Eye Examination Report',
      'Driving School Completion Certificate (for new applicants)',
      'Blood group confirmation'
    ],
    requiredDocumentName: 'Medical Examination Certificate / Driving School Certificate',
    serviceSpecificFields: [
      {
        id: 'licenseClass',
        label: 'Driving License Category Requested',
        type: 'select',
        options: ['Category B (Light Vehicle / Saloon Car)', 'Category C (Medium / Heavy Truck)', 'Category D (PSV / Public Service Van)', 'Category A (Motorcycle / Boda Boda)'],
        required: true
      },
      {
        id: 'bloodGroup',
        label: 'Applicant Blood Group',
        type: 'select',
        options: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
        required: true
      },
      {
        id: 'hudumaCollectionCentre',
        label: 'Smart DL Biometric Card Collection Centre',
        type: 'select',
        options: ['NTSA Headquarters Upper Hill', 'Huduma Centre GPO', 'Huduma Centre City Square', 'Huduma Centre Thika', 'Huduma Centre Machakos', 'Huduma Centre Mombasa GPO'],
        required: true
      }
    ]
  },
  {
    id: 'brs-business-name',
    code: 'BRS',
    name: 'Business Name Registration & Incorporation',
    agencyName: 'Business Registration Service (BRS)',
    category: 'Business & Commercial',
    statutoryFee: 950,
    processingTimeDays: 3,
    logoUrl: '/logos/brs.png',
    description: 'Official enterprise name reservation and statutory issuance of Certificate of Registration under the Business Names Act.',
    requirements: [
      'National ID Copies of all Proprietors / Partners',
      'KRA Personal PIN Certificate',
      'Proposed Business Names (Primary & Alternative choices)',
      'Physical business premises address / Land Reference number'
    ],
    requiredDocumentName: 'KRA PIN Certificate / National ID Copy',
    serviceSpecificFields: [
      {
        id: 'proposedName1',
        label: 'Proposed Business Name (First Choice)',
        type: 'text',
        placeholder: 'e.g., Summit Logistics Enterprises',
        required: true
      },
      {
        id: 'proposedName2',
        label: 'Alternative Business Name (Second Choice)',
        type: 'text',
        placeholder: 'e.g., Summit Freight & Cargo Solutions',
        required: true
      },
      {
        id: 'natureOfBusiness',
        label: 'Principal Nature of Business Activities',
        type: 'select',
        options: ['General Retail & Wholesale Trading', 'Information Technology & Software Services', 'Logistics, Freight & Transport Services', 'Agribusiness & Farm Produce Supply', 'Hospitality, Catering & Restaurant'],
        required: true
      },
      {
        id: 'physicalAddress',
        label: 'Physical Street / Building Address',
        type: 'text',
        placeholder: 'e.g., Suite 4B, Kencom Plaza, Moi Avenue',
        required: true
      }
    ]
  },
  {
    id: 'crs-birth-cert',
    code: 'CRS',
    name: 'Birth Certificate Issuance & Replacement',
    agencyName: 'Department of Civil Registration Services (CRS)',
    category: 'Civil Status & Identity',
    statutoryFee: 150,
    processingTimeDays: 4,
    logoUrl: '/logos/crs.png',
    description: 'Issuance of official birth certificate or certified replacement copy from the National Civil Registry records.',
    requirements: [
      'Hospital Birth Notification card / Form 1',
      'Copies of Parents\' National Identity Cards',
      'Applicant National ID (if over 18 years)',
      'Chief\'s letter for home births'
    ],
    requiredDocumentName: 'Birth Notification Card / Clinical Hospital Card',
    serviceSpecificFields: [
      {
        id: 'childFullName',
        label: 'Full Name of Child / Subject',
        type: 'text',
        placeholder: 'Enter child legal full names',
        required: true
      },
      {
        id: 'placeOfBirth',
        label: 'Place of Birth (Hospital / Facility Name)',
        type: 'text',
        placeholder: 'e.g., Kenyatta National Hospital / Pumwani',
        required: true
      },
      {
        id: 'motherNationalId',
        label: 'Mother\'s National ID / Passport Number',
        type: 'text',
        placeholder: '7 or 8 digits',
        required: true
      },
      {
        id: 'fatherNationalId',
        label: 'Father\'s National ID / Passport Number',
        type: 'text',
        placeholder: '7 or 8 digits (or N/A)',
        required: false
      }
    ]
  },
  {
    id: 'immigration-passport',
    code: 'IMMIGRATION',
    name: 'Kenyan Ordinary Passport Application',
    agencyName: 'Department of Immigration Services',
    category: 'Citizenship & Travel Documents',
    statutoryFee: 7550,
    processingTimeDays: 14,
    logoUrl: '/logos/immigration.png',
    description: 'Application and biometric clearance for standard 34-page East African Community biometric Kenyan passport.',
    requirements: [
      'Original Birth Certificate and photocopy',
      'Original National Identity Card and photocopy',
      'Three clear passport photographs adhering to ICAO biometric standards',
      'Copy of recommender\'s National ID card'
    ],
    requiredDocumentName: 'Original Birth Certificate & Recommender ID Copy',
    serviceSpecificFields: [
      {
        id: 'passportBookletType',
        label: 'Passport Series / Booklet Size',
        type: 'select',
        options: ['Series A (34 Pages - Standard Citizen)', 'Series B (50 Pages - Frequent Traveler)', 'Series C (66 Pages - Commercial / Diplomatic)'],
        required: true
      },
      {
        id: 'recommenderFullName',
        label: 'Recommender Citizen Full Name',
        type: 'text',
        placeholder: 'e.g., Dr. Peter Ochieng',
        required: true
      },
      {
        id: 'recommenderId',
        label: 'Recommender National ID Number',
        type: 'text',
        placeholder: '7 or 8 digits',
        required: true
      },
      {
        id: 'biometricEnrolmentStation',
        label: 'Biometric Enrolment & Interview Center',
        type: 'select',
        options: ['Nyayo House (Nairobi)', 'Mombasa Immigration Office', 'Kisumu Immigration Office', 'Eldoret Immigration Office', 'Embu Immigration Office', 'Nakuru Immigration Office'],
        required: true
      }
    ]
  }
];
