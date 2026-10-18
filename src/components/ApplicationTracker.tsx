'use client';

import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, CitizenAccount } from '@/types';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  X
} from 'lucide-react';

interface ApplicationTrackerProps {
  requests: ServiceRequest[];
  authenticatedCitizen?: CitizenAccount | null;
  initialQuery?: string;
  onApplyNew: () => void;
}

export default function ApplicationTracker({
  requests,
  authenticatedCitizen,
  initialQuery = '',
  onApplyNew
}: ApplicationTrackerProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const citizenFiltered = authenticatedCitizen
    ? requests.filter(
        r => r.applicant.nationalId === authenticatedCitizen.nationalId ||
             r.applicant.email.toLowerCase() === authenticatedCitizen.email.toLowerCase()
      )
    : requests;

  const displayedRequests = searchQuery.trim()
    ? requests.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          r.referenceNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.streetOrLandmark.toLowerCase().includes(q) ||
          r.location.county.toLowerCase().includes(q) ||
          r.applicant.fullName.toLowerCase().includes(q) ||
          r.applicant.nationalId.includes(q)
        );
      })
    : citizenFiltered;

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>PENDING</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>IN PROGRESS</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RESOLVED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStepState = (currentStatus: RequestStatus, step: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED') => {
    const order: RequestStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-lexend">
      <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
                  Municipal Status Stepper
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Track Public Service Requests
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Check real-time progress of reported streetlights, water pipeline leaks, road hazards, and sanitation requests as municipal dispatch teams move cases from <strong>Pending</strong> to <strong>In Progress</strong> to <strong>Resolved</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracking code (e.g. REQ-2026...)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#008751]"
                />
              </div>

              <button
                type="button"
                onClick={onApplyNew}
                className="px-5 py-2.5 rounded-2xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>
        </div>

        {displayedRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              No Service Requests Found
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {searchQuery
                ? `No requests match "${searchQuery}". Please check the tracking reference code and try again.`
                : 'You have not submitted any public service requests yet.'}
            </p>
            <button
              onClick={onApplyNew}
              className="px-6 py-2.5 rounded-3xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold transition-colors"
            >
              Report a Municipal Issue Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedRequests.map((req) => {
              const pendingState = getStepState(req.status, 'PENDING');
              const inProgressState = getStepState(req.status, 'IN_PROGRESS');
              const resolvedState = getStepState(req.status, 'RESOLVED');

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xs font-bold text-[#008751] font-mono tracking-wider">
                          {req.referenceNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-semibold text-gray-600">
                          {req.categoryLabel}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[11px] text-gray-500">
                          Priority: <strong>{req.priority}</strong>
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {req.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {getStatusBadge(req.status)}
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-2 text-center relative">
                      <div className="absolute top-4 left-[16%] right-[16%] h-1 bg-gray-200 -z-0">
                        <div
                          className="h-full bg-[#008751] transition-all duration-500"
                          style={{
                            width:
                              req.status === 'RESOLVED'
                                ? '100%'
                                : req.status === 'IN_PROGRESS'
                                ? '50%'
                                : '0%'
                          }}
                        ></div>
                      </div>

                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                            pendingState === 'completed'
                              ? 'bg-[#008751] text-white'
                              : pendingState === 'active'
                              ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          1
                        </div>
                        <span className="text-xs font-bold text-gray-900">Pending</span>
                        <span className="text-[10px] text-gray-400">Request Logged</span>
                      </div>

                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                            inProgressState === 'completed'
                              ? 'bg-[#008751] text-white'
                              : inProgressState === 'active'
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          2
                        </div>
                        <span className="text-xs font-bold text-gray-900">In Progress</span>
                        <span className="text-[10px] text-gray-400">Dispatched Crew</span>
                      </div>

                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                            resolvedState === 'active' || resolvedState === 'completed'
                              ? 'bg-[#008751] text-white ring-4 ring-emerald-100'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          3
                        </div>
                        <span className="text-xs font-bold text-gray-900">Resolved</span>
                        <span className="text-[10px] text-gray-400">Repaired &amp; Closed</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-gray-100 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block">
                        Issue Description
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        {req.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block">
                        Location &amp; Reporting Citizen
                      </span>
                      <div className="flex items-start space-x-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">{req.location.county} County</span>
                          <span className="block text-gray-500">{req.location.subCounty} &bull; {req.location.ward || 'Central Ward'} &bull; {req.location.streetOrLandmark}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 pt-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Reported by {req.applicant.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Submitted {new Date(req.submittedAt).toLocaleDateString()} at {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block">
                        Photo Evidence &amp; Verification
                      </span>
                      {req.imageUrl ? (
                        <div
                          onClick={() => setSelectedImage(req.imageUrl || null)}
                          className="cursor-pointer group relative inline-block rounded-2xl overflow-hidden border border-gray-200"
                        >
                          <img
                            src={req.imageUrl}
                            alt="Incident Evidence"
                            className="h-24 w-36 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity">
                            View Full Photo
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 text-[11px]">
                          No photo attached
                        </div>
                      )}
                    </div>
                  </div>

                  {req.adminFeedback && (
                    <div className="mt-6 pt-5 border-t border-gray-100 bg-gray-50/80 rounded-2xl p-4 text-xs">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-[#008751]" />
                        <span className="font-bold text-gray-900">
                          Official Municipal Response: {req.adminFeedback.officerName} ({req.adminFeedback.officerBadge})
                        </span>
                        {req.adminFeedback.assignedTeam && (
                          <span className="text-[11px] text-gray-500">
                            • Assigned: <strong>{req.adminFeedback.assignedTeam}</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-6">
                        {req.adminFeedback.notes}
                      </p>
                      {req.adminFeedback.resolvedAt && (
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-1 pl-6">
                          Resolved On: {new Date(req.adminFeedback.resolvedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl p-2 overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged incident evidence"
                className="max-h-[85vh] w-auto rounded-2xl object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
