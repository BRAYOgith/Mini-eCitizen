'use client';

import React, { useState } from 'react';
import { ServiceRequest, ApplicationStatus } from '@/types';
import {
  Search,
  Check,
  Copy,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

interface ApplicationTrackerProps {
  requests: ServiceRequest[];
  onViewCertificate: (request: ServiceRequest) => void;
  onApplyNew: () => void;
}

export default function ApplicationTracker({
  requests,
  onViewCertificate,
  onApplyNew
}: ApplicationTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.applicant.nationalId.includes(searchTerm) ||
      req.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && req.status === statusFilter;
  });

  const handleCopy = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusDisplay = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return { text: 'Submitted', color: 'text-blue-700 font-semibold' };
      case 'UNDER_REVIEW':
        return { text: 'Under Review', color: 'text-amber-700 font-semibold' };
      case 'ACTION_REQUIRED':
        return { text: 'Action Required', color: 'text-orange-700 font-semibold' };
      case 'APPROVED':
      case 'ISSUED':
        return { text: 'Approved & Issued', color: 'text-[#006633] font-bold' };
      case 'REJECTED':
        return { text: 'Declined', color: 'text-red-700 font-semibold' };
      default:
        return { text: status, color: 'text-gray-700' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Application Register
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track and manage your submitted public service requests.
          </p>
        </div>

        <button
          onClick={onApplyNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <span>New Application</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Reference, ID, or Name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'ISSUED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-10 text-center">
          <p className="text-sm font-semibold text-gray-700">No applications found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm ? `No results matching "${searchTerm}".` : 'No submitted applications in this category.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {filteredRequests.map((req) => {
                  const statusInfo = getStatusDisplay(req.status);

                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <span>{req.referenceNumber}</span>
                          <button
                            onClick={() => handleCopy(req.referenceNumber)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy reference"
                          >
                            {copiedId === req.referenceNumber ? (
                              <Check className="w-3.5 h-3.5 text-[#006633]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-900 max-w-[220px]">
                        {req.serviceName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-600">
                        {req.agencyCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block font-semibold text-gray-900">{req.applicant.fullName}</span>
                        <span className="text-[11px] text-gray-500 font-mono">ID: {req.applicant.nationalId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {new Date(req.submittedAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={statusInfo.color}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {(req.status === 'APPROVED' || req.status === 'ISSUED') && req.certificate ? (
                          <button
                            onClick={() => onViewCertificate(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">In Progress</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
