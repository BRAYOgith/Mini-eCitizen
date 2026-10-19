'use client';

import React, { useState, useEffect } from 'react';
import { ServiceRequest, CitizenAccount } from '@/types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
  Wrench,
  ShieldCheck,
  Building2,
  User,
  Eye,
  X,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface PublicVerificationProps {
  requests: ServiceRequest[];
  initialSearchQuery?: string;
  authenticatedCitizen?: CitizenAccount | null;
  onNavigateApply?: () => void;
}

export default function PublicVerificationModal({
  requests,
  initialSearchQuery = '',
  authenticatedCitizen,
  onNavigateApply
}: PublicVerificationProps) {
  const [query, setQuery] = useState(initialSearchQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchQuery));
  const [matchedRequest, setMatchedRequest] = useState<ServiceRequest | null>(null);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialSearchQuery) {
      setQuery(initialSearchQuery);
      setHasSearched(true);
      const found = requests.find(
        (r) => r.referenceNumber.toLowerCase() === initialSearchQuery.trim().toLowerCase()
      );
      setMatchedRequest(found || null);
    }
  }, [initialSearchQuery, requests]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const found = requests.find(
      (r) => r.referenceNumber.toLowerCase() === clean
    );
    setMatchedRequest(found || null);
  };

  const handleSelectFromList = (req: ServiceRequest) => {
    setQuery(req.referenceNumber);
    setMatchedRequest(req);
    setHasSearched(true);
  };

  const maskNationalId = (id: string) => {
    if (!id || id.length <= 4) return id || 'N/A';
    const start = id.slice(0, 2);
    const end = id.slice(-2);
    return `${start}****${end}`;
  };

  const userRequests = authenticatedCitizen
    ? requests.filter((r) => r.applicant.nationalId === authenticatedCitizen.nationalId)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-lexend space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-5 h-5 text-[#006633]" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            Public Incident Tracking &amp; Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Track Incident Resolution Status
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
          Check the real-time status of your reported incident, monitor county dispatch operations, and inspect official administrative action notes.
        </p>
      </div>

      {authenticatedCitizen && userRequests.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                My Reported Incidents ({userRequests.length})
              </h2>
              <p className="text-xs text-gray-500">
                Incidents registered under National ID: {authenticatedCitizen.nationalId}
              </p>
            </div>
            {onNavigateApply && (
              <button
                type="button"
                onClick={onNavigateApply}
                className="text-xs text-[#006633] font-semibold hover:underline"
              >
                + Report New Incident
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userRequests.map((req) => {
              const isSelected = matchedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectFromList(req)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#006633] bg-emerald-50/40 ring-1 ring-[#006633]'
                      : 'border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono font-bold text-xs text-gray-900">
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
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {req.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
                    <span>{req.location.county} • {req.location.subCounty}</span>
                    <span>{new Date(req.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-xs">
        <label className="block text-xs font-bold text-gray-900 mb-2">
          Search by Tracking Reference Number
        </label>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. REQ-2026-KIA-4823 or REQ-2026-NBI-1042..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Track Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {hasSearched && (
        <div>
          {matchedRequest ? (
            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-xs space-y-6 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    Official eCitizen Tracking Record
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black font-mono text-gray-900">
                      {matchedRequest.referenceNumber}
                    </h2>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Registered on {new Date(matchedRequest.submittedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  {matchedRequest.status === 'PENDING' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Status: PENDING REVIEW</span>
                    </div>
                  )}
                  {matchedRequest.status === 'IN_PROGRESS' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Status: IN PROGRESS</span>
                    </div>
                  )}
                  {matchedRequest.status === 'RESOLVED' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Status: RESOLVED &amp; CLOSED</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Resolution Progress Workflow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Step 1: Incident Registered</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Citizen report registered in the county queue with severity calculation.
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium mt-2 block">
                      Completed &bull; {new Date(matchedRequest.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    matchedRequest.status === 'IN_PROGRESS' || matchedRequest.status === 'RESOLVED'
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      {matchedRequest.status === 'IN_PROGRESS' || matchedRequest.status === 'RESOLVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={
                        matchedRequest.status === 'IN_PROGRESS' || matchedRequest.status === 'RESOLVED'
                          ? 'text-blue-900'
                          : 'text-gray-500'
                      }>
                        Step 2: Field Dispatch &amp; Inspection
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {matchedRequest.status === 'PENDING'
                        ? 'Awaiting review and crew assignment by county triage officers.'
                        : matchedRequest.adminFeedback?.assignedTeam || 'Assigned to Municipal Response Unit.'}
                    </p>
                    <span className="text-[10px] font-medium mt-2 block text-gray-500">
                      {matchedRequest.status === 'PENDING' ? 'Pending Review' : 'Crew Active'}
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    matchedRequest.status === 'RESOLVED'
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      {matchedRequest.status === 'RESOLVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={matchedRequest.status === 'RESOLVED' ? 'text-emerald-900' : 'text-gray-500'}>
                        Step 3: Work Completed &amp; Closed
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {matchedRequest.status === 'RESOLVED'
                        ? (matchedRequest.adminFeedback?.notes || 'Repairs completed and verified.')
                        : 'Repairs or municipal service action pending on site.'}
                    </p>
                    <span className="text-[10px] font-medium mt-2 block text-gray-500">
                      {matchedRequest.status === 'RESOLVED' ? 'Resolved & Closed' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              </div>

              {matchedRequest.adminFeedback && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider">
                    <Wrench className="w-4 h-4 text-[#006633]" />
                    <span>Official County Administration Response</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Assigned Response Team:</span>
                      <strong className="text-gray-900">{matchedRequest.adminFeedback.assignedTeam || 'Municipal Field Operations'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Supervising Officer:</span>
                      <strong className="text-gray-900">{matchedRequest.adminFeedback.officerName} ({matchedRequest.adminFeedback.officerBadge})</strong>
                    </div>
                  </div>

                  {matchedRequest.adminFeedback.notes && (
                    <div className="pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-500 text-[11px] block mb-1">Resolution Remarks &amp; Updates:</span>
                      <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed">
                        {matchedRequest.adminFeedback.notes}
                      </p>
                    </div>
                  )}

                  {matchedRequest.adminFeedback.resolvedAt && (
                    <div className="text-[11px] text-gray-500">
                      Resolved on: {new Date(matchedRequest.adminFeedback.resolvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Incident Report Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Category &amp; Priority:</span>
                    <span className="font-bold text-gray-900">{matchedRequest.categoryLabel}</span>
                    <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {matchedRequest.priority} PRIORITY
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[11px] block">Location:</span>
                    <span className="font-bold text-gray-900">{matchedRequest.location.county} County</span>
                    <span className="block text-gray-600 text-[11px] mt-0.5">
                      {matchedRequest.location.subCounty}{matchedRequest.location.ward ? ` • ${matchedRequest.location.ward}` : ''}
                    </span>
                    <span className="block text-gray-500 text-[11px] mt-0.5 truncate" title={matchedRequest.location.streetOrLandmark}>
                      {matchedRequest.location.streetOrLandmark}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[11px] block">Applicant:</span>
                    <span className="font-bold text-gray-900">{matchedRequest.applicant.fullName}</span>
                    <span className="block text-gray-500 text-[11px] font-mono mt-0.5">
                      ID: {maskNationalId(matchedRequest.applicant.nationalId)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-900 block mb-1">Issue Description:</span>
                  <div className="bg-white rounded-lg p-3.5 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">{matchedRequest.title}</p>
                    <p className="text-gray-600">{matchedRequest.description}</p>
                  </div>
                </div>

                {matchedRequest.imageUrl && (
                  <div>
                    <span className="text-xs font-bold text-gray-900 block mb-1">Attached Photo Evidence:</span>
                    <img
                      src={matchedRequest.imageUrl}
                      alt="Incident Evidence"
                      className="w-36 h-28 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setZoomImageUrl(matchedRequest.imageUrl || null)}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-red-900">
                Incident Reference Not Found
              </h3>
              <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">
                No active municipal service request matches tracking number &ldquo;{query}&rdquo;. Please verify the code or check your submission confirmation.
              </p>
            </div>
          )}
        </div>
      )}

      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="High resolution evidence"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
