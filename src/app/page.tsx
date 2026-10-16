'use client';

import React, { useState, useEffect } from 'react';
import { PublicService, ServiceRequest, ApplicationStatus, OfficerReviewRecord, OfficerAccount } from '@/types';
import { OFFICIAL_SERVICES } from '@/lib/services-data';
import {
  getStoredRequests,
  createNewRequest,
  updateRequestReview,
  getStoredOfficerSession,
  setStoredOfficerSession,
  clearDatabase
} from '@/lib/storage';
import Navbar from '@/components/Navbar';
import ServiceCard from '@/components/ServiceCard';
import ApplicationWizard from '@/components/ApplicationWizard';
import ApplicationTracker from '@/components/ApplicationTracker';
import OfficerDashboard from '@/components/OfficerDashboard';
import OfficerAuth from '@/components/OfficerAuth';
import DigitalCertificateModal from '@/components/DigitalCertificateModal';
import PublicVerificationModal from '@/components/PublicVerificationModal';
import {
  Search,
  Building
} from 'lucide-react';

export default function Home() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [currentView, setCurrentView] = useState<'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify'>('catalog');
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<OfficerAccount | null>(null);
  const [activeCertificateRequest, setActiveCertificateRequest] = useState<ServiceRequest | null>(null);
  const [verificationInitialQuery, setVerificationInitialQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    const loadedRequests = getStoredRequests();
    setRequests(loadedRequests);

    const storedOfficer = getStoredOfficerSession();
    setAuthenticatedOfficer(storedOfficer);
  }, []);

  const pendingCount = requests.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW'
  ).length;

  const handleSelectService = (service: PublicService) => {
    setSelectedService(service);
    setCurrentView('apply');
  };

  const handleApplicationSubmit = (newRequest: ServiceRequest) => {
    const updated = createNewRequest(newRequest);
    setRequests(updated);
  };

  const handleUpdateRequest = (
    id: string,
    newStatus: ApplicationStatus,
    reviewRecord: OfficerReviewRecord,
    certificateData?: ServiceRequest['certificate']
  ) => {
    const updated = updateRequestReview(id, newStatus, reviewRecord, certificateData);
    setRequests(updated);
  };

  const handleClearData = () => {
    if (confirm('Clear all stored service applications from the database?')) {
      const cleared = clearDatabase();
      setRequests(cleared);
      alert('All applications cleared. Database is now completely empty.');
    }
  };

  const handleOfficerLogin = (officer: OfficerAccount) => {
    setAuthenticatedOfficer(officer);
    setStoredOfficerSession(officer);
    setCurrentView('officer');
  };

  const handleOfficerSignOut = () => {
    setAuthenticatedOfficer(null);
    setStoredOfficerSession(null);
    setCurrentView('catalog');
  };

  const handleViewCertificate = (request: ServiceRequest) => {
    setActiveCertificateRequest(request);
  };

  const handleVerifyOnline = (refNumber: string) => {
    setActiveCertificateRequest(null);
    setVerificationInitialQuery(refNumber);
    setCurrentView('verify');
  };

  const filteredServices = OFFICIAL_SERVICES.filter((svc) => {
    const matchesSearch =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || svc.code === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'officer' && !authenticatedOfficer) {
            setCurrentView('officer-auth');
          } else {
            setCurrentView(view);
          }
          if (view !== 'apply') setSelectedService(null);
        }}
        authenticatedOfficer={authenticatedOfficer}
        onClearData={handleClearData}
        pendingRequestsCount={pendingCount}
      />

      <main className="flex-1">
        {currentView === 'catalog' && (
          <div>
            <section className="bg-[#004d26] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-2 border-amber-400">
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-xs uppercase tracking-widest text-emerald-200 font-bold block mb-2">
                  Republic of Kenya Official Portal
                </span>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                  One Government, One Portal
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto mb-6 leading-relaxed">
                  Apply for official government services, pay statutory fees, and track your requests online across the Directorate of Criminal Investigations, NTSA, Business Registration Service, Civil Registry, and Immigration.
                </p>

                <div className="max-w-2xl mx-auto bg-white rounded-md p-1.5 shadow-sm flex flex-col sm:flex-row items-center gap-2 border border-gray-300">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a service (e.g. Police Clearance, Driving License, Business Name)..."
                      className="w-full pl-9 pr-3 py-2 text-gray-900 text-xs focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={() => {}}
                    className="w-full sm:w-auto px-5 py-2 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Services Directory
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Browse services by ministry or government agency.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                  {[
                    { id: 'ALL', label: 'All Services' },
                    { id: 'DCI', label: 'DCI' },
                    { id: 'NTSA', label: 'NTSA' },
                    { id: 'BRS', label: 'BRS' },
                    { id: 'CRS', label: 'Civil Registry' },
                    { id: 'IMMIGRATION', label: 'Immigration' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
                        categoryFilter === cat.id
                          ? 'bg-[#006633] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-md p-10 text-center">
                  <Building className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No Services Found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No services match your search &ldquo;{searchQuery}&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredServices.map((svc) => (
                    <ServiceCard
                      key={svc.id}
                      service={svc}
                      onSelect={handleSelectService}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {currentView === 'apply' && selectedService && (
          <ApplicationWizard
            service={selectedService}
            onCancel={() => {
              setSelectedService(null);
              setCurrentView('catalog');
            }}
            onSubmitSuccess={(newReq) => {
              handleApplicationSubmit(newReq);
            }}
          />
        )}

        {currentView === 'track' && (
          <ApplicationTracker
            requests={requests}
            onViewCertificate={handleViewCertificate}
            onApplyNew={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'officer-auth' && (
          <OfficerAuth
            onAuthenticated={handleOfficerLogin}
            onCancel={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'officer' && (
          authenticatedOfficer ? (
            <OfficerDashboard
              requests={requests}
              officerAccount={authenticatedOfficer}
              onUpdateRequest={handleUpdateRequest}
              onSignOut={handleOfficerSignOut}
              onViewCertificate={handleViewCertificate}
            />
          ) : (
            <OfficerAuth
              onAuthenticated={handleOfficerLogin}
              onCancel={() => setCurrentView('catalog')}
            />
          )
        )}

        {currentView === 'verify' && (
          <PublicVerificationModal
            requests={requests}
            initialSearchQuery={verificationInitialQuery}
            onClose={() => setCurrentView('catalog')}
            onViewCertificate={handleViewCertificate}
          />
        )}
      </main>

      {activeCertificateRequest && (
        <DigitalCertificateModal
          request={activeCertificateRequest}
          onClose={() => setActiveCertificateRequest(null)}
          onVerifyOnline={handleVerifyOnline}
        />
      )}

      <footer className="bg-[#1e293b] text-gray-400 text-xs py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/ecitizen-logo.png"
              alt="eCitizen Logo"
              className="h-10 w-auto object-contain bg-white p-1 rounded-sm"
            />
            <div>
              <p className="font-semibold text-white">
                Government of Kenya | eCitizen Portal
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Public Service Request System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <button onClick={() => setCurrentView('catalog')} className="hover:text-white transition-colors">
              Services
            </button>
            <button onClick={() => setCurrentView('track')} className="hover:text-white transition-colors">
              Track Request
            </button>
            <button onClick={() => setCurrentView('verify')} className="hover:text-white transition-colors">
              Verify Document
            </button>
            <button
              onClick={() => {
                if (authenticatedOfficer) {
                  setCurrentView('officer');
                } else {
                  setCurrentView('officer-auth');
                }
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              {authenticatedOfficer ? `Officer Console (${authenticatedOfficer.badgeNumber})` : 'Officer Portal'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
