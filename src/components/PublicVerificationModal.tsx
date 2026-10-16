'use client';

import React, { useState } from 'react';
import { ServiceRequest } from '@/types';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface PublicVerificationProps {
  requests: ServiceRequest[];
  initialSearchQuery?: string;
  onClose?: () => void;
  onViewCertificate?: (req: ServiceRequest) => void;
}

export default function PublicVerificationModal({
  requests,
  initialSearchQuery = '',
  onClose,
  onViewCertificate
}: PublicVerificationProps) {
  const [query, setQuery] = useState(initialSearchQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchQuery));
  const [matchedRequest, setMatchedRequest] = useState<ServiceRequest | null>(() => {
    if (!initialSearchQuery) return null;
    return (
      requests.find(
        (r) =>
          r.referenceNumber.toLowerCase() === initialSearchQuery.toLowerCase() ||
          r.certificate?.certificateNumber.toLowerCase() === initialSearchQuery.toLowerCase()
      ) || null
    );
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const found = requests.find(
      (r) =>
        r.referenceNumber.toLowerCase() === clean ||
        r.certificate?.certificateNumber.toLowerCase() === clean
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Document Verification Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Verify public service documents and certificates issued via the Government of Kenya eCitizen system.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-5 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Reference Number (e.g. ECZ-DCI-2026-839210) or Certificate Serial..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Verify Document</span>
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
              className="px-2 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-[11px] transition-colors border border-gray-200"
            >
              {r.referenceNumber}
            </button>
          ))}
          <button
            onClick={() => {
              setQuery('ECZ-FAKE-2026-000000');
              setMatchedRequest(null);
              setHasSearched(true);
            }}
            className="px-2 py-1 rounded-sm bg-red-50 hover:bg-red-100 text-red-700 font-mono text-[11px] transition-colors border border-red-200"
          >
            Test Invalid Code
          </button>
        </div>
      </div>

      {hasSearched && (
        <div>
          {matchedRequest ? (
            <div className="bg-white border-2 border-[#006633] rounded-md overflow-hidden">
              <div className="bg-[#006633] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <h3 className="text-sm font-bold text-white">
                    Official Government Record Verified
                  </h3>
                </div>

                <span className="text-xs font-semibold text-white">
                  Status: {matchedRequest.status}
                </span>
              </div>

              <div className="p-5 space-y-4 text-xs text-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Service
                    </span>
                    <span className="font-bold text-gray-900">
                      {matchedRequest.serviceName}
                    </span>
                    <span className="text-gray-600 block text-[11px] mt-0.5">
                      {matchedRequest.agencyCode} Portal
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Applicant
                    </span>
                    <span className="font-bold text-gray-900">
                      {matchedRequest.applicant.fullName}
                    </span>
                    <span className="text-gray-500 block text-[11px] font-mono mt-0.5">
                      National ID: {maskNationalId(matchedRequest.applicant.nationalId)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-semibold block">
                      Reference Code
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {matchedRequest.referenceNumber}
                    </span>
                    <span className="text-gray-500 block text-[11px] mt-0.5">
                      Submitted: {new Date(matchedRequest.submittedAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>

                {matchedRequest.certificate ? (
                  <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#006633]">
                        Certificate Serial: {matchedRequest.certificate.certificateNumber}
                      </span>
                      <span className="text-gray-600 text-[11px]">
                        Issued: {new Date(matchedRequest.certificate.issuedAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[10px]">Tamper-Proof Checksum</span>
                      <span className="font-mono font-bold text-gray-900">
                        {matchedRequest.certificate.securityChecksum}
                      </span>
                    </div>

                    {onViewCertificate && (
                      <div className="pt-2">
                        <button
                          onClick={() => onViewCertificate(matchedRequest)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>View Official Certificate Document</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900">Application In Progress</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        This request is legitimate and undergoing administrative review ({matchedRequest.status}).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-red-500 rounded-md p-6 text-center">
              <div className="w-10 h-10 bg-red-100 text-red-700 rounded-md flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No Record Found for &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                The reference code or certificate serial number provided does not exist in the official eCitizen registry.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
