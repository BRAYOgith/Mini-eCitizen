'use client';

import React, { useState } from 'react';
import { PublicService } from '@/types';
import { OFFICIAL_SERVICES } from '@/lib/services-data';
import { Search, Building2, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';

interface NationalMinistriesViewProps {
  onSelectService: (service: PublicService) => void;
  onBackToHome: () => void;
}

interface MinistryDefinition {
  id: string;
  name: string;
  stateDepartment: string;
  headquarters: string;
  description: string;
  serviceId?: string;
  logoUrl?: string;
  servicesOffered: string[];
}

const MINISTRIES: MinistryDefinition[] = [
  {
    id: 'min-interior',
    name: 'Ministry of Interior & National Administration',
    stateDepartment: 'State Department for Internal Security & National Registration',
    headquarters: 'Harambee House, Harambee Avenue, Nairobi',
    description: 'Responsible for public security, criminal intelligence, civil status registration, and immigration services.',
    serviceId: 'dci-good-conduct',
    logoUrl: '/logos/dci.png',
    servicesOffered: [
      'Police Clearance Certificate (Good Conduct - DCI)',
      'Birth Certificate Issuance & Replacement (CRS)',
      'Kenyan Ordinary & Biometric Passports (DIS)',
      'Alien Card & Work Permit Clearance'
    ]
  },
  {
    id: 'min-transport',
    name: 'Ministry of Roads and Transport',
    stateDepartment: 'State Department for Transport & Logistics',
    headquarters: 'Transcom House, Ngong Road, Nairobi',
    description: 'Manages national road safety regulations, motor vehicle registration, driver testing, and licensing.',
    serviceId: 'ntsa-driving-license',
    logoUrl: '/logos/ntsa.png',
    servicesOffered: [
      'Smart Driving License Application & Renewal (NTSA)',
      'Motor Vehicle Logbook Transfer & Search',
      'Road Service License (RSL) for PSVs',
      'Driving School Instructor Licensing'
    ]
  },
  {
    id: 'min-justice',
    name: 'State Law Office & Department of Justice',
    stateDepartment: 'Office of the Attorney General & Department of Justice',
    headquarters: 'Sheria House, Harambee Avenue, Nairobi',
    description: 'Statutory registration of commercial enterprises, public trustees, societies, and marriage solemnization.',
    serviceId: 'brs-business-name',
    logoUrl: '/logos/brs.png',
    servicesOffered: [
      'Business Name Registration & Incorporation (BRS)',
      'Private & Public Limited Company Incorporation',
      'Official Marriage Notice & Marriage Certificates',
      'Society & NGO Registration'
    ]
  },
  {
    id: 'min-immigration',
    name: 'Department of Immigration Services',
    stateDepartment: 'State Department for Citizen Services',
    headquarters: 'Nyayo House, Kenyatta Avenue, Nairobi',
    description: 'Issuance of Kenyan citizenship documentation, passports, visas, work permits, and permanent residency.',
    serviceId: 'immigration-passport',
    logoUrl: '/logos/immigration.png',
    servicesOffered: [
      'Ordinary 34-Page / 50-Page Biometric Passports',
      'Electronic Travel Authorization (eTA)',
      'Dual Citizenship Declaration',
      'Temporary Travel Permits'
    ]
  },
  {
    id: 'min-civil-reg',
    name: 'Department of Civil Registration Services',
    stateDepartment: 'State Department for Immigration & Citizen Services',
    headquarters: 'Hass Plaza, Lower Hill Road, Nairobi',
    description: 'Custodian of the National Civil Registry, records of vital events, births, and deaths across Kenya.',
    serviceId: 'crs-birth-cert',
    logoUrl: '/logos/crs.png',
    servicesOffered: [
      'Birth Certificate Issuance & Duplicate Replacement',
      'Death Certificate Registration',
      'Civil Registry Search & Record Rectification',
      'Late Registration of Vital Events'
    ]
  },
  {
    id: 'min-treasury',
    name: 'The National Treasury & Economic Planning',
    stateDepartment: 'State Department for Finance',
    headquarters: 'Treasury Building, Harambee Avenue, Nairobi',
    description: 'Mobilisation of public revenue, financial sector oversight, and digital tax compliance through KRA.',
    servicesOffered: [
      'Personal & Business KRA PIN Registration',
      'Tax Compliance Certificate (TCC) Clearance',
      'Customs & Excise Single Window Import Declarations',
      'iTax Electronic Filing & Assessments'
    ]
  },
  {
    id: 'min-lands',
    name: 'Ministry of Lands, Public Works & Housing',
    stateDepartment: 'State Department for Lands & Physical Planning',
    headquarters: 'Ardhi House, 1st Ngong Avenue, Nairobi',
    description: 'Administration of national land registry, digital land titles, affordable housing fund, and zoning.',
    servicesOffered: [
      'Official Land Title Search (ArdhiSasa)',
      'Boma Yangu Affordable Housing Savings Account',
      'Land Rent & Rates Clearance Certification',
      'Building Plan Approvals'
    ]
  },
  {
    id: 'min-health',
    name: 'Ministry of Health',
    stateDepartment: 'State Department for Medical Services',
    headquarters: 'Afya House, Cathedral Road, Nairobi',
    description: 'Oversees national health policy, universal health coverage enrollment, and public health statutory compliance.',
    servicesOffered: [
      'Social Health Authority (SHA) Registration',
      'Food Handlers Medical Clearance Certification',
      'Pharmacy & Poisons Board Import Permits',
      'National Healthcare Facility Licensing'
    ]
  }
];

export default function NationalMinistriesView({
  onSelectService,
  onBackToHome
}: NationalMinistriesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MINISTRIES.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.stateDepartment.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.servicesOffered.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleLaunchService = (serviceId?: string) => {
    if (!serviceId) return;
    const found = OFFICIAL_SERVICES.find((s) => s.id === serviceId);
    if (found) {
      onSelectService(found);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-lexend">
      <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <button onClick={onBackToHome} className="hover:text-gray-900 font-medium">
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">National Ministries & Agencies</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src="/coat-of-arms-kenya.svg"
                  alt="Republic of Kenya Coat of Arms"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
                  Republic of Kenya
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                National Ministries &amp; State Agencies
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
                Explore ministries, state departments, and government agencies delivering automated public services under the Government of Kenya digital transformation framework.
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter ministries or services..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#008751]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ministry) => (
            <div
              key={ministry.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    {ministry.logoUrl ? (
                      <img
                        src={ministry.logoUrl}
                        alt={ministry.name}
                        className="h-12 w-auto max-w-[80px] object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 leading-snug">
                        {ministry.name}
                      </h2>
                      <span className="text-xs text-gray-500 block mt-0.5">
                        {ministry.headquarters}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {ministry.description}
                </p>

                <div className="pt-3 border-t border-gray-100 mb-4">
                  <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block mb-2">
                    Key Online Services:
                  </span>
                  <ul className="space-y-1.5">
                    {ministry.servicesOffered.map((svc, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                        <span className="text-[#008751] font-bold">•</span>
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {ministry.serviceId ? (
                <button
                  type="button"
                  onClick={() => handleLaunchService(ministry.serviceId)}
                  className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Apply for Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="mt-2 py-2 text-center text-xs text-gray-400 border-t border-gray-100">
                  Services accessible via integrated agency gateway
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
