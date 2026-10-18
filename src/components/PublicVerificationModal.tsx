'use client';

import React, { useState } from 'react';
import { ServiceRequest } from '@/types';
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
  Building2
} from 'lucide-react';

interface PublicVerificationProps {
  requests: ServiceRequest[];
  initialSearchQuery?: string;
  onClose?: () => void;
}

export default function PublicVerificationModal({
  requests,
  initialSearchQuery = '',
  onClose
}: PublicVerificationProps) {
  const [query, setQuery] = useState(initialSearchQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchQuery));
  const [matchedRequest, setMatchedRequest] = useState<ServiceRequest | null>(() => {
    if (!initialSearchQuery) return null;
    return (
      requests.find(
        (r) => r.referenceNumber.toLowerCase() === initialSearchQuery.toLowerCase()
      ) || null
    );
  });

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

  const maskNationalId = (id: string) => {
    if (id.length <= 4) return id;
    const start = id.slice(0, 2);
    const end = id.slice(-2);
    return `${start}****${end}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-lexend">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-[#006633]" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            Public Registry Verification
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Official Request Verification Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Verify authentic public service incident reports, municipal dispatch orders, and resolution records registered on the eCitizen platform.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-5 mb-6 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Reference Number (e.g. REQ-2026-NBI-1042)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Verify Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Quick Test Samples:</span>
          {requests.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setQuery(r.referenceNumber);
                setMatchedRequest(r);
                setHasSearched(true);
              }}
              className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-[11px] transition-colors border border-gray-200"
            >
              {r.referenceNumber}
            </button>
          ))}
          <button
            onClick={() => {
              setQuery('REQ-INVALID-0000');
              setMatchedRequest(null);
              setHasSearched(true);
            }}
            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-mono text-[11px] transition-colors border border-red-200"
          >
            Test Invalid Code
          </button>
        </div>
      </div>

      {hasSearched && (
        <div>
          {matchedRequest ? (
            <div className="bg-white border-2 border-[#006633] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#006633] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Official Municipal Record Verified
                    </h3>
                    <span className="text-[11px] text-emerald-200 font-mono">
                      Ref: {matchedRequest.referenceNumber}
                    </span>
                  </div>
                </div>

                <div>
                  {matchedRequest.status === 'PENDING' && (
                    <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Status: PENDING REVIEW
                    </span>
                  )}
                  {matchedRequest.status === 'IN_PROGRESS' && (
                    <span className="text-xs font-bold text-blue-700 inline-flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      Status: IN PROGRESS
                    </span>
                  )}
                  {matchedRequest.status === 'RESOLVED' && (
                    <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Status: RESOLVED &amp; CLOSED
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-5 text-xs text-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Category
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {matchedRequest.categoryLabel}
                    </span>
                    <span className="text-gray-500 block text-[11px] mt-0.5">
                      Priority: {matchedRequest.priority}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Reporting Citizen
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {matchedRequest.applicant.fullName}
                    </span>
                    <span className="text-gray-500 block text-[11px] font-mono mt-0.5">
                      National ID: {maskNationalId(matchedRequest.applicant.nationalId)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Incident Location
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {matchedRequest.location.county} County
                    </span>
                    <span className="text-gray-500 block text-[11px] mt-0.5 truncate" title={matchedRequest.location.streetOrLandmark}>
                      {matchedRequest.location.streetOrLandmark}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Issue Description
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">{matchedRequest.title}</p>
                    <p className="text-gray-600">{matchedRequest.description}</p>
                  </div>
                </div>

                {matchedRequest.adminFeedback && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <Wrench className="w-4 h-4 text-emerald-700" />
                      <span>Official Action &amp; Assigned Unit</span>
                    </div>
                    {matchedRequest.adminFeedback.assignedTeam && (
                      <p className="text-xs text-gray-800">
                        <strong className="text-gray-900">Assigned Team:</strong> {matchedRequest.adminFeedback.assignedTeam}
                      </p>
                    )}
                    {matchedRequest.adminFeedback.notes && (
                      <p className="text-xs text-gray-700">
                        <strong className="text-gray-900">Admin Remarks:</strong> {matchedRequest.adminFeedback.notes}
                      </p>
                    )}
                    <div className="text-[11px] text-gray-500 flex items-center gap-3 pt-1">
                      <span>Officer: {matchedRequest.adminFeedback.officerName}</span>
                      <span>Badge: {matchedRequest.adminFeedback.officerBadge}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-red-900">
                Record Not Found in Public Registry
              </h3>
              <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">
                No active municipal service request matches tracking number &ldquo;{query}&rdquo;. Please verify the reference code format.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
