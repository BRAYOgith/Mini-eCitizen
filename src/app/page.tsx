'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  BookOpen,
  CreditCard,
  Percent,
  Users,
  Award,
  Home as HomeIcon,
  Briefcase,
  Heart,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [currentView, setCurrentView] = useState<'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify'>('catalog');
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<OfficerAccount | null>(null);
  const [activeCertificateRequest, setActiveCertificateRequest] = useState<ServiceRequest | null>(null);
  const [verificationInitialQuery, setVerificationInitialQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceById = (serviceId: string) => {
    const found = OFFICIAL_SERVICES.find((s) => s.id === serviceId);
    if (found) {
      handleSelectService(found);
    }
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

  const focusSearch = () => {
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const filteredServices = OFFICIAL_SERVICES.filter((svc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      svc.name.toLowerCase().includes(query) ||
      svc.agencyName.toLowerCase().includes(query) ||
      svc.description.toLowerCase().includes(query) ||
      svc.code.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-lexend text-gray-900">
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
        onSearchClick={focusSearch}
      />

      <main className="flex-1">
        {currentView === 'catalog' && (
          <div>
            <div className="relative z-20 bg-gray-900">
              <div className="absolute inset-0 isolate h-full w-full">
                <div
                  className="relative w-full h-full bg-no-repeat bg-bottom bg-cover"
                  style={{ backgroundImage: "url('/hero-home-1.jpg')" }}
                >
                  <div className="w-full h-full absolute top-0 left-0 bg-black/55 md:bg-gradient-to-t md:from-gray-950/80 md:via-gray-900/50 md:to-black/30"></div>
                </div>
              </div>

              <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="max-w-none pt-12 text-left md:max-w-2xl lg:max-w-4xl sm:pt-24 lg:pt-32">
                  <h1 className="text-[1.65rem] sm:text-3xl lg:text-4xl font-normal tracking-normal text-white leading-8 sm:leading-10">
                    Government of Kenya services <strong className="font-bold">simplified</strong> <br />
                    All your government records <strong className="font-bold">unified</strong>
                  </h1>
                </div>

                <div className="mt-8 sm:mt-12 rounded-t-3xl bg-gray-900/60 px-5 py-6 backdrop-blur-md sm:px-10 sm:py-8 lg:bg-gray-900/50 border-t border-x border-white/10">
                  <div className="relative rounded-3xl shadow-sm">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type name of service, ministry, department, agency etc..."
                        className="block h-14 w-full border-0 transition-none pl-12 pr-6 placeholder:text-gray-400 text-gray-900 bg-white focus:outline-none rounded-[30px] text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-8 mb-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleSelectServiceById('immigration-passport')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <BookOpen className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Apply for<br />a Passport
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectServiceById('ntsa-driving-license')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <CreditCard className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Apply for a<br />Driving License
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchQuery('Tax')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <Percent className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        KRA<br />Services
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectServiceById('crs-birth-cert')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <Users className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Apply for a<br />Birth Certificate
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectServiceById('dci-good-conduct')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <Award className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Apply for<br />Good Conduct
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchQuery('Housing')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <HomeIcon className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Save for<br />Housing
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectServiceById('brs-business-name')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <Briefcase className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Register a<br />Business
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchQuery('Marriage')}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                        <Heart className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="mt-2 text-xs font-normal text-white/90 group-hover:text-white leading-tight">
                        Marriage<br />Certificate
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-b-3xl relative overflow-hidden bg-[#00595E]">
                <div className="absolute inset-0 h-full w-full">
                  <img
                    src="/banner-1.jpg"
                    className="h-full w-full object-cover"
                    alt="eCitizen Banner"
                  />
                </div>

                <div className="relative sm:min-h-[220px] lg:min-h-[260px] w-full inline-flex justify-start items-center bg-black/25">
                  <div className="w-full">
                    <div className="py-8 sm:py-12 px-5 sm:px-10 max-w-3xl">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-white leading-snug">
                        Over <strong className="font-bold">22,000</strong> Government services now available from <strong className="font-bold">100+</strong> Ministries, Counties, Departments and Agencies.
                      </h2>
                    </div>

                    <div className="px-5 sm:px-10 py-5 sm:flex items-center justify-between bg-gradient-to-tr from-black/60 to-black/40">
                      <h3 className="text-white text-lg sm:text-xl font-normal">
                        Get started on eCitizen today
                      </h3>
                      <div className="flex space-x-3 items-center mt-3 sm:mt-0">
                        <button
                          onClick={() => {
                            if (authenticatedOfficer) {
                              setCurrentView('officer');
                            } else {
                              setCurrentView('officer-auth');
                            }
                          }}
                          className="rounded-3xl bg-white text-gray-800 hover:bg-gray-100 px-5 py-2 text-sm font-medium transition-colors"
                        >
                          Sign in
                        </button>
                        <button
                          onClick={() => {
                            if (!authenticatedOfficer) {
                              setCurrentView('officer-auth');
                            } else {
                              setCurrentView('officer');
                            }
                          }}
                          className="rounded-3xl bg-[#008751] hover:bg-[#007043] text-white px-5 py-2 text-sm font-medium transition-colors"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Agencies
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>View all agencies</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {filteredServices.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                  <p className="text-base font-semibold text-gray-700">No agencies found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No results found for &ldquo;{searchQuery}&rdquo;. Try another term.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-[#008751] text-white rounded-3xl text-xs font-medium"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((svc) => (
                    <ServiceCard
                      key={svc.id}
                      service={svc}
                      onSelect={handleSelectService}
                    />
                  ))}

                  <div
                    onClick={() => setSearchQuery('KRA')}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="h-14 w-auto flex items-center font-bold text-red-600 text-lg tracking-tight">
                          KENYA REVENUE AUTHORITY
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 mt-1" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mt-5 mb-2 leading-snug group-hover:text-[#008751] transition-colors">
                        Kenya Revenue Authority
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        To enhance mobilisation of government revenue and ensure tax compliance through unified online services.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>Online Tax Compliance</span>
                      <span className="text-blue-600 font-medium">Learn more</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setSearchQuery('Marriage')}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <img
                          src="/coat-of-arms-kenya.svg"
                          alt="Registrar of Marriages"
                          className="h-10 w-auto object-contain"
                        />
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 mt-1" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mt-5 mb-2 leading-snug group-hover:text-[#008751] transition-colors">
                        Registrar Of Marriages
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Utilize OAG&apos;s online services for efficient marriage notice registration and celebration certificates.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>Civil Marriages Directorate</span>
                      <span className="text-blue-600 font-medium">Learn more</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-gray-100/70 py-16 sm:py-20 border-t border-gray-200/60">
              <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                    The single point of access for all government services
                  </h2>
                  <p className="mt-3 text-base text-gray-600 max-w-xl">
                    Enjoy the convenience. Get information about government online services and make applications quickly and easily.
                  </p>
                </div>

                <div className="mt-12 sm:mt-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-[#008751]/10 flex items-center justify-center text-[#008751] mb-5">
                        <UserCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        One Log-in, all government services
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        All you need is one account. Citizens and residents can register with an ID number and access all state agencies.
                      </p>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-5">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        A single unified citizen&apos;s profile
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        Your information as a citizen or resident from across government will be accessible through your profile.
                      </p>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 mb-5">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        Convenient service access
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        Search, apply and pay for services online, receive progress notifications and access all your downloads in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

      <footer className="bg-[#272E28] text-white font-lexend" aria-labelledby="footer-heading">
        <div className="px-4 sm:px-6 lg:px-8 pt-16 pb-10 mx-auto max-w-screen-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 border-b border-white/10 pb-12">
            <div>
              <div
                onClick={() => setCurrentView('catalog')}
                className="cursor-pointer"
              >
                <img
                  src="/ecitizen-logo-light.svg"
                  alt="eCitizen Logo"
                  className="w-auto h-8 sm:h-10"
                />
              </div>
              <p className="text-sm text-gray-300 mt-4 max-w-sm">
                Giving Kenyans easy access to online government services.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12 text-sm">
              <div>
                <span className="font-semibold text-white block mb-3">Portal Navigation</span>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <button onClick={() => setCurrentView('catalog')} className="hover:text-white transition-colors">
                      Home
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentView('track')} className="hover:text-white transition-colors">
                      Track Application
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentView('verify')} className="hover:text-white transition-colors">
                      Verify Document
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (authenticatedOfficer) {
                          setCurrentView('officer');
                        } else {
                          setCurrentView('officer-auth');
                        }
                      }}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                    >
                      {authenticatedOfficer ? `Officer Console (${authenticatedOfficer.badgeNumber})` : 'Officer Portal'}
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <span className="font-semibold text-white block mb-3">Legal & Support</span>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <span className="hover:text-white cursor-pointer">Help &amp; Support</span>
                  </li>
                  <li>
                    <span className="hover:text-white cursor-pointer">Terms &amp; Conditions</span>
                  </li>
                  <li>
                    <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                  </li>
                  <li>
                    <button
                      onClick={handleClearData}
                      className="text-red-400 hover:text-red-300 transition-colors text-xs"
                    >
                      Reset Applications
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-gray-400 gap-4">
            <p>
              &copy; {new Date().getFullYear()} eCitizen. All rights reserved. Republic of Kenya.
            </p>
            <p>
              Public Service Request System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
