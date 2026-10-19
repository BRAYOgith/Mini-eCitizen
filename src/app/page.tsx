'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PublicService,
  ServiceRequest,
  RequestStatus,
  AdminResolution,
  OfficerAccount,
  CitizenAccount,
  ServiceCategory
} from '@/types';
import { OFFICIAL_SERVICES, SERVICE_CATEGORIES } from '@/lib/services-data';
import {
  getStoredRequests,
  createNewRequest,
  updateRequestStatus,
  getStoredOfficerSession,
  setStoredOfficerSession,
  getStoredCitizenSession,
  setStoredCitizenSession,
  calculateAnalytics
} from '@/lib/storage';
import Navbar from '@/components/Navbar';
import ServiceCard from '@/components/ServiceCard';
import ApplicationWizard from '@/components/ApplicationWizard';
import OfficerDashboard from '@/components/OfficerDashboard';
import OfficerAuth from '@/components/OfficerAuth';
import CitizenAuth from '@/components/CitizenAuth';
import NationalMinistriesView from '@/components/NationalMinistriesView';
import CountiesView from '@/components/CountiesView';
import HelpSupportView from '@/components/HelpSupportView';
import PublicVerificationModal from '@/components/PublicVerificationModal';
import {
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Lightbulb,
  Droplet,
  Trash2,
  AlertTriangle,
  Waves,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  PlusCircle,
  Lock
} from 'lucide-react';

export default function Home() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [currentView, setCurrentView] = useState<
    | 'catalog'
    | 'apply'
    | 'track'
    | 'officer'
    | 'officer-auth'
    | 'verify'
    | 'citizen-auth'
    | 'national'
    | 'counties'
    | 'support'
  >('catalog');
  const [citizenAuthMode, setCitizenAuthMode] = useState<'login' | 'register'>('login');
  const [citizenAuthNotice, setCitizenAuthNotice] = useState<string>('');
  const [pendingCategoryAfterAuth, setPendingCategoryAfterAuth] = useState<ServiceCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>('STREETLIGHT');
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState<CitizenAccount | null>(null);
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<OfficerAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadedRequests = getStoredRequests();
    setRequests(loadedRequests);

    const storedCitizen = getStoredCitizenSession();
    setAuthenticatedCitizen(storedCitizen);

    const storedOfficer = getStoredOfficerSession();
    setAuthenticatedOfficer(storedOfficer);
  }, []);

  const analytics = calculateAnalytics(requests);

  const handleSelectService = (service: PublicService) => {
    if (!authenticatedCitizen) {
      setPendingCategoryAfterAuth(service.category);
      setCitizenAuthNotice('Please sign in or register with your National ID to access this government service.');
      setCitizenAuthMode('login');
      setCurrentView('citizen-auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedCategory(service.category);
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ServiceCategory) => {
    if (!authenticatedCitizen) {
      setPendingCategoryAfterAuth(cat);
      setCitizenAuthNotice('Please sign in or register with your National ID to access this government service.');
      setCitizenAuthMode('login');
      setCurrentView('citizen-auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedCategory(cat);
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationSubmit = (newRequest: ServiceRequest) => {
    const updated = createNewRequest(newRequest);
    setRequests(updated);
  };

  const handleUpdateRequest = (
    id: string,
    newStatus: RequestStatus,
    resolution: AdminResolution
  ) => {
    const updated = updateRequestStatus(id, newStatus, resolution);
    setRequests(updated);
  };

  const handleCitizenLogin = (citizen: CitizenAccount) => {
    setAuthenticatedCitizen(citizen);
    setStoredCitizenSession(citizen);
    setCitizenAuthNotice('');
    if (pendingCategoryAfterAuth) {
      setSelectedCategory(pendingCategoryAfterAuth);
      setPendingCategoryAfterAuth(null);
      setCurrentView('apply');
    } else {
      setCurrentView('catalog');
    }
  };

  const handleCitizenSignOut = () => {
    setAuthenticatedCitizen(null);
    setStoredCitizenSession(null);
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
    const q = searchQuery.toLowerCase();
    return (
      svc.name.toLowerCase().includes(q) ||
      svc.agencyName.toLowerCase().includes(q) ||
      svc.description.toLowerCase().includes(q) ||
      svc.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-lexend text-gray-900 antialiased">
      <Navbar
        currentView={currentView}
        onNavigate={(view, authMode) => {
          if (view === 'citizen-auth') {
            setCitizenAuthMode(authMode || 'login');
            setCitizenAuthNotice('');
            setCurrentView('citizen-auth');
          } else if (view === 'officer' && !authenticatedOfficer) {
            setCurrentView('officer-auth');
          } else {
            setCurrentView(view);
          }
        }}
        authenticatedCitizen={authenticatedCitizen}
        onCitizenSignOut={handleCitizenSignOut}
        authenticatedOfficer={authenticatedOfficer}
        onOfficerSignOut={handleOfficerSignOut}
        pendingRequestsCount={analytics.openCases}
        onSearchClick={focusSearch}
      />

      <main className="flex-1">
        {currentView === 'catalog' && (
          <div>
            <div className="relative">
              <div className="relative z-20 bg-gray-900">
                <div className="absolute inset-0 isolate h-full w-full">
                  <div
                    className="relative w-full h-full bg-no-repeat bg-bottom bg-cover -z-10"
                    style={{ backgroundImage: "url('/hero-home-1.jpg')" }}
                  >
                    <div className="w-full h-full absolute top-0 left-0 bg-black/60 md:bg-black/55"></div>
                  </div>
                </div>

                <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-none pt-12 text-left md:max-w-2xl lg:max-w-4xl sm:pt-28 relative z-20">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-emerald-400" />
                      <span>Public Service Request &amp; Incident Reporting Portal</span>
                    </p>
                    <h1 className="text-[1.575rem] sm:text-3xl lg:text-4xl font-medium tracking-wide text-white leading-8 sm:leading-10" style={{ color: '#ffffff' }}>
                      Government of Kenya services <strong className="text-white font-bold" style={{ color: '#ffffff' }}>simplified</strong> <br />
                      Report public incidents &amp; civic issues directly to your county
                    </h1>
                    <p className="mt-3 text-sm text-gray-200 max-w-2xl leading-relaxed">
                      Facing a municipal issue? Citizens can report broken streetlights, water pipe bursts, uncollected garbage, road damage/potholes, or drainage problems for prompt county response.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory('STREETLIGHT')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-[#008751] hover:bg-[#007043] text-white text-sm font-semibold shadow-md transition-colors"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Report an Incident Now</span>
                      </button>
                      <span className="text-xs text-gray-300">
                        Or select an incident category below
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 rounded-t-3xl bg-gray-900/60 px-5 py-5 backdrop-blur-md sm:px-10 sm:py-8 border-t border-white/10">
                    <div className="relative rounded-3xl shadow-xs" id="search_area">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search or describe an issue (e.g. Broken streetlight, water pipe burst, garbage collection, pothole)..."
                          className="block h-14 w-full border-gray-100 pl-12 pr-6 placeholder:text-gray-400 text-gray-900 bg-white focus:outline-hidden rounded-[30px] text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-white text-xs font-semibold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-emerald-400" />
                        <span>Select Incident Category to Report:</span>
                      </div>
                      <span className="text-[11px] text-gray-300">
                        Click any category below to immediately start your service request submission
                      </span>
                    </div>

                    <div className="mt-5 mb-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory('STREETLIGHT')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <Lightbulb className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Broken<br />Streetlight
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('WATER')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <Droplet className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Water Supply<br />&amp; Leakage
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('GARBAGE')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <Trash2 className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Garbage<br />Collection
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('ROAD')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <AlertTriangle className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Road Damage<br />&amp; Potholes
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('SEWERAGE')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <Waves className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Blocked Sewerage<br />&amp; Drainage
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('PUBLIC_HEALTH')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <ShieldAlert className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Public Health<br />Hazards
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCategory('OTHER')}
                        className="flex flex-col items-center group focus:outline-hidden"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-white group-hover:scale-105 transition-all" style={{ color: '#ffffff' }}>
                          <HelpCircle className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="mt-2 text-xs font-normal text-white group-hover:font-medium leading-tight" style={{ color: '#ffffff' }}>
                          Other Civic<br />Requests
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
                      alt="Banner image"
                    />
                  </div>

                  <div className="relative sm:min-h-[250px] lg:min-h-[314px] w-full inline-flex justify-start items-center bg-black/20">
                    <div className="w-full">
                      <div className="py-10 sm:py-14 px-5 sm:px-10 max-w-3xl">
                        <h2 className="text-xl sm:text-3xl font-medium tracking-tight text-white leading-snug" style={{ color: '#ffffff' }}>
                          Over <strong className="text-white font-bold" style={{ color: '#ffffff' }}>22,000</strong> Government services now available from <strong className="text-white font-bold" style={{ color: '#ffffff' }}>100+</strong> Ministries, Counties, Departments and Agencies.
                        </h2>
                      </div>

                      {authenticatedCitizen ? (
                        <div className="px-5 sm:px-10 py-6 sm:flex items-center justify-between bg-gradient-to-tr from-black/75 to-black/50">
                          <div>
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Citizen Verified Account Active</span>
                            </p>
                            <h3 className="text-white text-xl sm:text-2xl font-semibold" style={{ color: '#ffffff' }}>
                              Welcome, {authenticatedCitizen.fullName}
                            </h3>
                            <p className="text-xs text-gray-300 mt-1">
                              Logged in with Kenyan National ID <span className="font-mono font-bold text-white">{authenticatedCitizen.nationalId}</span> &bull; Submit public service requests to your county.
                            </p>
                          </div>
                          <div className="flex space-x-3 items-center mt-4 sm:mt-0">
                            <button
                              onClick={() => {
                                setSelectedCategory('STREETLIGHT');
                                setCurrentView('apply');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="rounded-3xl whitespace-nowrap bg-[#008751] hover:bg-[#007043] py-2.5 px-6 font-semibold text-white shadow-xs text-sm transition-colors flex items-center gap-2"
                            >
                              <PlusCircle className="w-4 h-4" />
                              <span>Report Incident Now</span>
                            </button>
                            <button
                              onClick={handleCitizenSignOut}
                              className="rounded-3xl whitespace-nowrap border border-white/20 bg-white/10 hover:bg-white/20 py-2.5 px-4 font-medium text-white text-sm transition-colors"
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      ) : authenticatedOfficer ? (
                        <div className="px-5 sm:px-10 py-7 sm:flex items-center justify-between bg-gradient-to-tr from-gray-900/90 to-black/70 border-t border-emerald-500/30">
                          <div>
                            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                              Authenticated Admin Session
                            </span>
                            <h3 className="text-white text-xl sm:text-2xl font-normal mt-0.5" style={{ color: '#ffffff' }}>
                              Public Service Officer Console ({authenticatedOfficer.badgeNumber})
                            </h3>
                            <p className="text-xs text-gray-300 mt-1">
                              Logged in as {authenticatedOfficer.fullName} • {authenticatedOfficer.department || 'National Administration'}
                            </p>
                          </div>
                          <div className="flex space-x-3 items-center mt-4 sm:mt-0">
                            <button
                              onClick={() => {
                                setCurrentView('officer');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="rounded-3xl whitespace-nowrap bg-[#008751] hover:bg-[#007043] py-2.5 px-6 font-semibold text-white shadow-xs text-sm transition-colors flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Open Admin Dashboard</span>
                            </button>
                            <button
                              onClick={handleOfficerSignOut}
                              className="rounded-3xl whitespace-nowrap border border-white/20 bg-white/10 hover:bg-white/20 py-2.5 px-4 font-medium text-white text-sm transition-colors"
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-5 sm:px-10 py-7 sm:flex items-center justify-between bg-gradient-to-tr from-black/60 to-black/40">
                          <h3 className="text-white text-xl sm:text-2xl font-normal" style={{ color: '#ffffff' }}>
                            Get started on eCitizen today
                          </h3>
                          <div className="flex space-x-4 items-center lg:justify-end mt-4 sm:mt-0">
                            <button
                              onClick={() => {
                                setCitizenAuthNotice('');
                                setCitizenAuthMode('login');
                                setCurrentView('citizen-auth');
                              }}
                              className="block md:inline w-full md:w-auto text-center rounded-3xl whitespace-nowrap border border-transparent bg-white py-2 px-4 font-medium text-gray-800 shadow-xs hover:bg-gray-200 focus:outline-hidden text-sm transition-colors"
                            >
                              Sign in
                            </button>
                            <button
                              onClick={() => {
                                setCitizenAuthNotice('');
                                setCitizenAuthMode('register');
                                setCurrentView('citizen-auth');
                              }}
                              className="block md:inline w-full md:w-auto text-center rounded-3xl whitespace-nowrap border border-transparent bg-[#008751] py-2 px-4 font-medium text-white shadow-xs hover:bg-[#007043] focus:outline-hidden text-sm transition-colors"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {authenticatedCitizen && requests.filter((r) => r.applicant.nationalId === authenticatedCitizen.nationalId).length > 0 && (
              <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                      My Reported Incidents ({requests.filter((r) => r.applicant.nationalId === authenticatedCitizen.nationalId).length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your registered municipal issue reports under National ID: {authenticatedCitizen.nationalId}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('track');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#006633] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all tracking details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requests
                    .filter((r) => r.applicant.nationalId === authenticatedCitizen.nationalId)
                    .slice(0, 3)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs font-bold text-gray-900">
                              {req.referenceNumber}
                            </span>
                            {req.status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <AlertCircle className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {req.status === 'IN_PROGRESS' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                <Clock className="w-3 h-3" />
                                In Progress
                              </span>
                            )}
                            {req.status === 'RESOLVED' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-gray-900 truncate">
                            {req.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {req.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-gray-500 text-[11px]">
                            {req.location.county} &bull; {req.location.subCounty}
                          </span>
                          <button
                            onClick={() => {
                              setActiveTrackingCode(req.referenceNumber);
                              setCurrentView('track');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="font-semibold text-[#006633] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Track Status</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-5 py-8">
              <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                      County Departments &amp; Response Units
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Official municipal and county agencies that receive, dispatch, and resolve your public incident reports
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('national')}
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View all departments</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <p className="text-base font-medium text-gray-700">No agencies found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      No results found for &ldquo;{searchQuery}&rdquo;. Try another search term.
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
                      onClick={() => handleSelectCategory('WATER')}
                      className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="h-14 w-auto flex items-center font-bold text-blue-700 text-lg tracking-tight">
                            NAIROBI WATER &amp; SEWERAGE
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 mt-1" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mt-5 mb-2 leading-snug group-hover:text-[#008751] transition-colors">
                          Nairobi City Water &amp; Sewerage Company
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Report ruptured trunk water pipes, sewage overflow, and schedule water meter maintenance across Nairobi.
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Water Leakage &amp; Supply</span>
                        <span className="text-[#008751] font-semibold inline-flex items-center gap-1">
                          Report Issue <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:py-30 mt-5 bg-gray-100 py-16 sm:py-20">
              <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    The single point of access for all government services
                  </h2>
                  <p className="mt-4 text-base md:w-5/12 text-gray-600 leading-relaxed">
                    Enjoy the convenience. Get information about government online services and make applications quickly and easily.
                  </p>
                </div>

                <div className="mt-16 lg:mt-20">
                  <div className="space-y-10 lg:grid lg:grid-cols-3 lg:gap-9 lg:space-y-0">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-[#008751]/10 flex items-center justify-center text-[#008751] mb-5">
                        <UserCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900">
                        One Log-in, all government services
                      </h3>
                      <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
                        All you need is one account. Citizens and residents can register with an ID number.
                      </p>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-5">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900">
                        A single unified citizen&apos;s profile
                      </h3>
                      <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
                        Your information as a citizen or resident from across government will be accessible through your profile.
                      </p>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 mb-5">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900">
                        Convenient service access
                      </h3>
                      <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
                        Search, apply and pay for services online, receive progress notifications and access all your downloads in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'national' && (
          <NationalMinistriesView
            onSelectService={handleSelectService}
            onBackToHome={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'counties' && (
          <CountiesView
            onSelectService={handleSelectService}
            onBackToHome={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'support' && (
          <HelpSupportView
            onBackToHome={() => setCurrentView('catalog')}
            onNavigateVerify={() => setCurrentView('verify')}
          />
        )}

        {currentView === 'citizen-auth' && (
          <CitizenAuth
            initialMode={citizenAuthMode}
            noticeMessage={citizenAuthNotice}
            onAuthenticated={handleCitizenLogin}
            onCancel={() => {
              setCitizenAuthNotice('');
              setCurrentView('catalog');
            }}
            onSwitchToOfficer={() => setCurrentView('officer-auth')}
          />
        )}

        {currentView === 'apply' && (
          <ApplicationWizard
            initialCategory={selectedCategory}
            authenticatedCitizen={authenticatedCitizen}
            onCancel={() => {
              setSelectedCategory(null);
              setCurrentView('catalog');
            }}
            onSubmitSuccess={(newReq) => {
              handleApplicationSubmit(newReq);
            }}
            onNavigateTrack={(refNumber) => {
              setActiveTrackingCode(refNumber);
              setCurrentView('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRequireAuth={() => {
              setPendingCategoryAfterAuth(selectedCategory || 'STREETLIGHT');
              setCitizenAuthNotice('Please sign in or register with your National ID to access this government service.');
              setCitizenAuthMode('login');
              setCurrentView('citizen-auth');
            }}
          />
        )}

        {currentView === 'track' && (
          <PublicVerificationModal
            requests={requests}
            initialSearchQuery={activeTrackingCode}
            authenticatedCitizen={authenticatedCitizen}
            onNavigateApply={() => {
              setSelectedCategory('STREETLIGHT');
              setCurrentView('apply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            initialSearchQuery=""
            authenticatedCitizen={authenticatedCitizen}
            onNavigateApply={() => {
              setSelectedCategory('STREETLIGHT');
              setCurrentView('apply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <footer className="bg-[#272E28] text-white font-lexend" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="px-6 pt-20 pb-8 mx-auto max-w-screen-2xl lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between space-y-10 lg:space-y-0">
            <div className="text-center sm:text-left">
              <div
                onClick={() => setCurrentView('catalog')}
                className="cursor-pointer inline-block"
              >
                <img
                  className="w-auto h-6 sm:h-8 xl:h-10 mx-auto sm:mx-0"
                  src="/ecitizen-logo-light.svg"
                  alt="eCitizen Logo"
                />
              </div>
              <p className="text-sm leading-6 text-gray-300 mt-4 max-w-sm">
                Giving Kenyans easy access to online government services.
              </p>
            </div>

            <div>
              <ul role="list" className="space-y-4 sm:space-y-0 sm:space-x-8 sm:flex text-base font-medium text-gray-300">
                <li className="text-center sm:text-left">
                  <button onClick={() => setCurrentView('catalog')} className="hover:text-white transition-colors">
                    Home
                  </button>
                </li>
                <li className="text-center sm:text-left">
                  <button onClick={() => setCurrentView('national')} className="hover:text-white transition-colors">
                    National
                  </button>
                </li>
                <li className="text-center sm:text-left">
                  <button onClick={() => setCurrentView('counties')} className="hover:text-white transition-colors">
                    Counties
                  </button>
                </li>
                <li className="text-center sm:text-left">
                  <button onClick={() => setCurrentView('support')} className="hover:text-white transition-colors">
                    Help &amp; Support
                  </button>
                </li>
                <li className="text-center sm:text-left">
                  <button
                    onClick={() => {
                      if (authenticatedOfficer) {
                        setCurrentView('officer');
                      } else {
                        setCurrentView('officer-auth');
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-8 mt-16 border-t border-white/10 md:flex-row">
            <p className="text-sm leading-5 text-center text-gray-400">
              &copy; {new Date().getFullYear()} eCitizen. All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
