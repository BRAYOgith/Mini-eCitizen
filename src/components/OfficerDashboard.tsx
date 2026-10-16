'use client';

import React, { useState } from 'react';
import { ServiceRequest, ApplicationStatus, OfficerReviewRecord, OfficerAccount } from '@/types';
import {
  generateCertificateNumber,
  computeSecurityChecksum,
  sanitizeInput
} from '@/lib/security';
import {
  ShieldAlert,
  FileText,
  Search,
  Eye,
  X,
  FileCheck2,
  LogOut,
  FolderOpen
} from 'lucide-react';

interface OfficerDashboardProps {
  requests: ServiceRequest[];
  officerAccount: OfficerAccount;
  onUpdateRequest: (
    id: string,
    newStatus: ApplicationStatus,
    reviewRecord: OfficerReviewRecord,
    certificateData?: ServiceRequest['certificate']
  ) => void;
  onSignOut: () => void;
  onViewCertificate: (request: ServiceRequest) => void;
}

export default function OfficerDashboard({
  requests,
  officerAccount,
  onUpdateRequest,
  onSignOut,
  onViewCertificate
}: OfficerDashboardProps) {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = requests.reduce((acc, curr) => acc + curr.statutoryFee, 0);
  const pendingCount = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED' || r.status === 'ISSUED').length;

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.applicant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.applicant.nationalId.includes(searchQuery);

    const matchesAgency = agencyFilter === 'ALL' || req.agencyCode === agencyFilter;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

    return matchesSearch && matchesAgency && matchesStatus;
  });

  const handleOpenDossier = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setReviewNotes(req.reviewRecord?.notes || '');
  };

  const handleApprove = () => {
    if (!selectedRequest) return;
    const certNumber = generateCertificateNumber(selectedRequest.agencyCode);
    const issuedAt = new Date().toISOString();
    const checksum = computeSecurityChecksum(
      selectedRequest.referenceNumber,
      selectedRequest.applicant.nationalId,
      issuedAt
    );

    const reviewRecord: OfficerReviewRecord = {
      reviewedAt: issuedAt,
      officerId: officerAccount.badgeNumber,
      officerName: officerAccount.fullName,
      notes: sanitizeInput(reviewNotes) || 'Verified and approved according to department regulatory standards.',
      decision: 'APPROVED'
    };

    const certData = {
      certificateNumber: certNumber,
      issuedAt,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      securityChecksum: checksum
    };

    onUpdateRequest(selectedRequest.id, 'ISSUED', reviewRecord, certData);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    if (!reviewNotes.trim()) {
      alert('Please provide official rejection remarks explaining the grounds for decline.');
      return;
    }

    const reviewRecord: OfficerReviewRecord = {
      reviewedAt: new Date().toISOString(),
      officerId: officerAccount.badgeNumber,
      officerName: officerAccount.fullName,
      notes: sanitizeInput(reviewNotes),
      decision: 'REJECTED'
    };

    onUpdateRequest(selectedRequest.id, 'REJECTED', reviewRecord);
    setSelectedRequest(null);
  };

  const handleRequestQuery = () => {
    if (!selectedRequest) return;
    if (!reviewNotes.trim()) {
      alert('Please specify what correction or additional documentation is required from the citizen.');
      return;
    }

    const reviewRecord: OfficerReviewRecord = {
      reviewedAt: new Date().toISOString(),
      officerId: officerAccount.badgeNumber,
      officerName: officerAccount.fullName,
      notes: sanitizeInput(reviewNotes),
      decision: 'ACTION_REQUIRED'
    };

    onUpdateRequest(selectedRequest.id, 'ACTION_REQUIRED', reviewRecord);
    setSelectedRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1e293b] text-white rounded-md p-6 mb-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#006633] text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Officer Administration Console
              </h1>
              <p className="text-xs text-gray-400">
                Departmental Application Review and Clearance Register
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="font-semibold block text-white">{officerAccount.fullName}</span>
              <span className="text-gray-400 text-[11px] block">{officerAccount.department} ({officerAccount.badgeNumber})</span>
            </div>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/80 rounded-md p-3.5 border border-gray-700">
            <span className="text-gray-400 text-xs block mb-1">Total Submissions</span>
            <span className="text-2xl font-bold text-white">{requests.length}</span>
          </div>

          <div className="bg-gray-800/80 rounded-md p-3.5 border border-gray-700">
            <span className="text-gray-400 text-xs block mb-1">Pending Review</span>
            <span className="text-2xl font-bold text-amber-400">{pendingCount}</span>
          </div>

          <div className="bg-gray-800/80 rounded-md p-3.5 border border-gray-700">
            <span className="text-gray-400 text-xs block mb-1">Issued Certificates</span>
            <span className="text-2xl font-bold text-emerald-400">{approvedCount}</span>
          </div>

          <div className="bg-gray-800/80 rounded-md p-3.5 border border-gray-700">
            <span className="text-gray-400 text-xs block mb-1">Revenue Reconciled</span>
            <span className="text-xl font-bold text-white">
              KES {totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Reference, Applicant Name, or ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#006633]"
          >
            <option value="ALL">All Departments</option>
            <option value="DCI">DCI</option>
            <option value="NTSA">NTSA</option>
            <option value="BRS">BRS</option>
            <option value="CRS">Civil Registry</option>
            <option value="IMMIGRATION">Immigration</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white font-medium text-gray-700 focus:outline-hidden focus:border-[#006633]"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ISSUED">Issued</option>
            <option value="REJECTED">Declined</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-10 text-center">
          <FolderOpen className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">No applications registered</p>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            {requests.length === 0
              ? 'There are currently 0 citizen service requests in the system. Applications submitted by citizens in the Services Directory will appear here for administrative clearance.'
              : 'No applications match your active search or department filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Applicant & ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {req.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-900 block">{req.applicant.fullName}</span>
                      <span className="text-[11px] text-gray-500 font-mono">ID: {req.applicant.nationalId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 max-w-[200px] truncate">
                      {req.serviceName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {req.agencyCode}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(req.submittedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {req.status === 'ISSUED' || req.status === 'APPROVED' ? (
                        <span className="text-[#006633]">Approved & Issued</span>
                      ) : req.status === 'REJECTED' ? (
                        <span className="text-red-700">Declined</span>
                      ) : req.status === 'ACTION_REQUIRED' ? (
                        <span className="text-orange-700">Action Required</span>
                      ) : (
                        <span className="text-amber-700">Pending Review</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.certificate && (
                          <button
                            onClick={() => onViewCertificate(req)}
                            className="px-2.5 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold transition-colors"
                            title="View Certificate"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDossier(req)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#006633] hover:bg-[#004d26] text-white font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-md max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl border border-gray-300 overflow-hidden">
            <div className="bg-[#1e293b] text-white px-5 py-3.5 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Dossier Review: {selectedRequest.referenceNumber}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-2 border-b border-gray-200 pb-1">
                  Citizen Identification Data
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-md border border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Name</span>
                    <span className="font-bold text-gray-900">{selectedRequest.applicant.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">National ID</span>
                    <span className="font-mono font-bold text-gray-900">{selectedRequest.applicant.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Phone</span>
                    <span className="font-bold text-gray-900">{selectedRequest.applicant.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Email</span>
                    <span className="font-bold text-gray-900">{selectedRequest.applicant.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">County</span>
                    <span className="font-bold text-gray-900">{selectedRequest.applicant.county}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Sub-County</span>
                    <span className="font-bold text-gray-900">{selectedRequest.applicant.subCounty}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-2 border-b border-gray-200 pb-1">
                  Service Criteria ({selectedRequest.serviceName})
                </h4>
                <div className="bg-gray-50 p-3.5 rounded-md border border-gray-200 space-y-2">
                  {Object.entries(selectedRequest.serviceData).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-bold text-gray-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-2 border-b border-gray-200 pb-1">
                  Uploaded Document
                </h4>
                <div className="bg-gray-50 p-3.5 rounded-md border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#006633]" />
                    <span className="font-semibold text-gray-900">{selectedRequest.documentName || 'Document.pdf'}</span>
                  </div>
                  {selectedRequest.documentDataUrl ? (
                    <a
                      href={selectedRequest.documentDataUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors"
                    >
                      View File
                    </a>
                  ) : (
                    <span className="text-gray-400">Attached</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-1">
                  Officer Clearance Remarks
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter administrative rationale or clearance findings..."
                  className="w-full p-2.5 rounded-md border border-gray-300 text-gray-900 text-xs focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
              </div>
            </div>

            <div className="bg-gray-100 px-6 py-3.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReject}
                  className="px-3.5 py-1.5 rounded-md bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleRequestQuery}
                  className="px-3.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                >
                  Request Query
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-1.5 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
                >
                  Approve & Issue Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
