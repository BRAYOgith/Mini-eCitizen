'use client';

import React, { useState } from 'react';
import {
  ServiceRequest,
  RequestStatus,
  AdminResolution,
  OfficerAccount,
  ServiceCategory,
  RequestPriority
} from '@/types';
import { calculateAnalytics } from '@/lib/storage';
import { SERVICE_CATEGORIES } from '@/lib/services-data';
import { sanitizeInput } from '@/lib/security';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Calendar,
  LogOut,
  FolderOpen,
  Eye,
  X,
  Layers,
  Wrench,
  Check,
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface OfficerDashboardProps {
  requests: ServiceRequest[];
  officerAccount: OfficerAccount;
  onUpdateRequest: (
    id: string,
    newStatus: RequestStatus,
    resolution: AdminResolution
  ) => void;
  onSignOut: () => void;
}

export default function OfficerDashboard({
  requests,
  officerAccount,
  onUpdateRequest,
  onSignOut
}: OfficerDashboardProps) {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [activeTabStatus, setActiveTabStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const [modalStatus, setModalStatus] = useState<RequestStatus>('IN_PROGRESS');
  const [modalAssignedTeam, setModalAssignedTeam] = useState('');
  const [modalNotes, setModalNotes] = useState('');

  const analytics = calculateAnalytics(requests);

  const filteredRequests = requests.filter(req => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      req.referenceNumber.toLowerCase().includes(q) ||
      req.title.toLowerCase().includes(q) ||
      req.description.toLowerCase().includes(q) ||
      req.applicant.fullName.toLowerCase().includes(q) ||
      req.applicant.nationalId.includes(q) ||
      req.applicant.phoneNumber.includes(q) ||
      req.location.county.toLowerCase().includes(q) ||
      req.location.streetOrLandmark.toLowerCase().includes(q);

    const matchesStatus = activeTabStatus === 'ALL' || req.status === activeTabStatus;
    const matchesCategory = selectedCategory === 'ALL' || req.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || req.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleOpenActionModal = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setModalStatus(req.status === 'PENDING' ? 'IN_PROGRESS' : req.status);
    setModalAssignedTeam(req.adminFeedback?.assignedTeam || '');
    setModalNotes(req.adminFeedback?.notes || '');
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const resolution: AdminResolution = {
      officerName: officerAccount.fullName,
      officerBadge: officerAccount.badgeNumber,
      updatedStatus: modalStatus,
      assignedTeam: sanitizeInput(modalAssignedTeam.trim()) || 'Municipal Field Operations Unit',
      notes: sanitizeInput(modalNotes.trim()) || 'Status updated by public municipal administration.',
      resolvedAt: modalStatus === 'RESOLVED' ? new Date().toISOString() : undefined
    };

    onUpdateRequest(selectedRequest.id, modalStatus, resolution);
    setSelectedRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-lexend space-y-8">
      <div className="bg-[#1f2922] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Public Service Operations Console
            </span>
            <span className="text-xs text-gray-400">
              Session: {officerAccount.badgeNumber}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Municipal Admin Dashboard
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl">
            Logged in as <strong className="text-white">{officerAccount.fullName}</strong> ({officerAccount.department || 'National Administration'}). Review, assign field response teams, and update incident request status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Requests</span>
            <Layers className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {analytics.totalRequests}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Registered incident reports
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open (Pending)</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">
            {analytics.openCases}
          </div>
          <p className="text-xs text-amber-800/80 mt-1">
            Awaiting inspection & triage
          </p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs bg-gradient-to-br from-blue-50/40 to-white">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">
            {analytics.inProgressCases}
          </div>
          <p className="text-xs text-blue-800/80 mt-1">
            Field technicians assigned
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {analytics.resolvedCases}
          </div>
          <p className="text-xs text-emerald-800/80 mt-1">
            Work completed & closed
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Resolution Rate</span>
            <TrendingUp className="w-5 h-5 text-[#006633]" />
          </div>
          <div className="text-3xl font-extrabold text-[#006633]">
            {analytics.resolutionRate}%
          </div>
          <div className="w-full bg-gray-100 rounded-sm h-2 mt-2 overflow-hidden">
            <div
              className="bg-[#006633] h-2 rounded-sm transition-all duration-500"
              style={{ width: `${analytics.resolutionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>Incident Requests by Municipal Category</span>
          <span className="text-xs font-normal text-gray-500">
            (Distribution breakdown)
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SERVICE_CATEGORIES.map(cat => {
            const count = analytics.categoryCounts[cat.id] || 0;
            const pct = analytics.totalRequests > 0 ? Math.round((count / analytics.totalRequests) * 100) : 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'ALL' : cat.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedCategory === cat.id
                    ? 'border-[#006633] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="text-xs text-gray-600 truncate font-medium">
                  {cat.label.split('&')[0].trim()}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold text-gray-900">{count}</span>
                  <span className="text-xs font-semibold text-gray-400">{pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-sm h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#006633] h-1.5 rounded-sm"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTabStatus('ALL')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTabStatus === 'ALL'
                    ? 'bg-[#006633] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Cases ({requests.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabStatus('PENDING')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTabStatus === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending ({analytics.openCases})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabStatus('IN_PROGRESS')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTabStatus === 'IN_PROGRESS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                In Progress ({analytics.inProgressCases})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabStatus('RESOLVED')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTabStatus === 'RESOLVED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Resolved ({analytics.resolvedCases})
              </button>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference, citizen, street..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">Filters:</span>
            <div className="flex items-center gap-1.5">
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1 rounded-md border border-gray-300 bg-white text-xs text-gray-900 focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-2 py-1 rounded-md border border-gray-300 bg-white text-xs text-gray-900 focus:outline-hidden"
              >
                <option value="ALL">All Priorities</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {(searchQuery || selectedCategory !== 'ALL' || selectedPriority !== 'ALL' || activeTabStatus !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedPriority('ALL');
                  setActiveTabStatus('ALL');
                }}
                className="text-xs text-emerald-700 hover:underline font-semibold ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-gray-900">
              No matching requests found
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              There are no public requests matching your active filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 divide-y divide-gray-200">
              <thead className="bg-gray-100/70 text-gray-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tracking Code &amp; Date</th>
                  <th className="py-3 px-4">Category &amp; Priority</th>
                  <th className="py-3 px-4">Issue Summary</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Citizen Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 font-mono">
                        {req.referenceNumber}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {req.categoryLabel}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.priority === 'EMERGENCY'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : req.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : req.priority === 'MEDIUM'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {req.priority} PRIORITY
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-gray-900 truncate" title={req.title}>
                        {req.title}
                      </div>
                      <div className="text-gray-500 line-clamp-2 mt-0.5" title={req.description}>
                        {req.description}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {req.location.county}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {req.location.subCounty}{req.location.ward ? ` • ${req.location.ward}` : ''}
                      </div>
                      <div className="text-gray-500 text-[11px] truncate max-w-[160px]" title={req.location.streetOrLandmark}>
                        {req.location.streetOrLandmark}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.imageUrl ? (
                        <button
                          type="button"
                          onClick={() => setZoomImageUrl(req.imageUrl || null)}
                          className="relative group rounded-md overflow-hidden border border-gray-200 hover:border-[#006633] transition-colors inline-block"
                          title="Click to view full photo evidence"
                        >
                          <img
                            src={req.imageUrl}
                            alt="Incident Evidence"
                            className="w-12 h-12 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No image</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        {req.applicant.fullName}
                      </div>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {req.applicant.phoneNumber}
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        ID: {req.applicant.nationalId}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Pending
                        </span>
                      )}
                      {req.status === 'IN_PROGRESS' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          In Progress
                        </span>
                      )}
                      {req.status === 'RESOLVED' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Resolved
                        </span>
                      )}

                      {req.adminFeedback?.assignedTeam && (
                        <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[130px]" title={req.adminFeedback.assignedTeam}>
                          {req.adminFeedback.assignedTeam}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        <Wrench className="w-3 h-3" />
                        Take Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Admin Incident Action
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Update Service Request: {selectedRequest.referenceNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Issue Title:</span>
                  <span className="font-bold text-gray-900">{selectedRequest.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Category:</span>
                  <span>{selectedRequest.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Location:</span>
                  <span>{selectedRequest.location.streetOrLandmark}, {selectedRequest.location.ward ? `${selectedRequest.location.ward}, ` : ''}{selectedRequest.location.subCounty}, {selectedRequest.location.county}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Reported By:</span>
                  <span>{selectedRequest.applicant.fullName} ({selectedRequest.applicant.phoneNumber})</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block mb-1">Description:</span>
                  <p className="text-gray-600 bg-white p-2.5 rounded border border-gray-200">
                    {selectedRequest.description}
                  </p>
                </div>
                {selectedRequest.imageUrl && (
                  <div className="pt-2">
                    <span className="font-semibold text-gray-900 block mb-1">Photo Evidence:</span>
                    <img
                      src={selectedRequest.imageUrl}
                      alt="Evidence"
                      className="w-32 h-24 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setZoomImageUrl(selectedRequest.imageUrl || null)}
                    />
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveAction} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">
                    Update Workflow Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                        modalStatus === 'PENDING'
                          ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="PENDING"
                        checked={modalStatus === 'PENDING'}
                        onChange={() => setModalStatus('PENDING')}
                        className="sr-only"
                      />
                      <AlertCircle className="w-5 h-5 text-amber-600 mb-1" />
                      <span className="text-xs font-bold text-gray-900">Pending</span>
                      <span className="text-[10px] text-gray-500">Under Review</span>
                    </label>

                    <label
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                        modalStatus === 'IN_PROGRESS'
                          ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="IN_PROGRESS"
                        checked={modalStatus === 'IN_PROGRESS'}
                        onChange={() => setModalStatus('IN_PROGRESS')}
                        className="sr-only"
                      />
                      <Clock className="w-5 h-5 text-blue-600 mb-1" />
                      <span className="text-xs font-bold text-gray-900">In Progress</span>
                      <span className="text-[10px] text-gray-500">Dispatched / Active</span>
                    </label>

                    <label
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                        modalStatus === 'RESOLVED'
                          ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="RESOLVED"
                        checked={modalStatus === 'RESOLVED'}
                        onChange={() => setModalStatus('RESOLVED')}
                        className="sr-only"
                      />
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                      <span className="text-xs font-bold text-gray-900">Resolved</span>
                      <span className="text-[10px] text-gray-500">Work Finished</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1">
                    Assigned Field Response Unit / Contractor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Westlands Water Pipe Emergency Unit #2"
                    value={modalAssignedTeam}
                    onChange={(e) => setModalAssignedTeam(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1">
                    Official Admin Feedback &amp; Resolution Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on action taken, findings, parts replaced, or expected completion date..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                  />
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#006633] hover:bg-[#004d26] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save &amp; Update Citizen Status
                  </button>
                </div>
              </form>
            </div>
          </div>
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
