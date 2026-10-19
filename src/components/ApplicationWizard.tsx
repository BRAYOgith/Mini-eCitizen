'use client';

import React, { useState, useEffect } from 'react';
import {
  ServiceRequest,
  ServiceCategory,
  RequestPriority,
  CitizenAccount
} from '@/types';
import {
  SERVICE_CATEGORIES,
  KENYA_COUNTIES,
  getCategoryDefinition,
  getSubCountiesForCounty,
  getWardsForSubCounty,
  CATEGORY_DEFAULT_HEADLINES,
  calculateSmartSeverity
} from '@/lib/services-data';
import {
  sanitizeInput,
  validateNationalId,
  validatePhoneNumber,
  validateFileUpload,
  checkSubmissionRateLimit
} from '@/lib/security';
import {
  Lightbulb,
  Droplet,
  Trash2,
  AlertTriangle,
  Waves,
  ShieldAlert,
  ArrowRight,
  Upload,
  CheckCircle2,
  X,
  Copy,
  Clock,
  MapPin,
  Image as ImageIcon,
  Lock,
  UserCheck,
  HelpCircle,
  Sparkles,
  Info,
  Shield
} from 'lucide-react';

interface ApplicationWizardProps {
  initialCategory?: ServiceCategory | null;
  authenticatedCitizen?: CitizenAccount | null;
  onCancel: () => void;
  onSubmitSuccess: (newRequest: ServiceRequest) => void;
  onNavigateTrack: (refNumber: string) => void;
  onRequireAuth?: () => void;
}

export default function ApplicationWizard({
  initialCategory,
  authenticatedCitizen,
  onCancel,
  onSubmitSuccess,
  onNavigateTrack,
  onRequireAuth
}: ApplicationWizardProps) {
  const [category, setCategory] = useState<ServiceCategory>(initialCategory || 'STREETLIGHT');
  const [customOtherCategory, setCustomOtherCategory] = useState('');
  const [title, setTitle] = useState(CATEGORY_DEFAULT_HEADLINES[initialCategory || 'STREETLIGHT']);
  const [description, setDescription] = useState('');
  
  const initialCounty = authenticatedCitizen?.county || 'Nairobi';
  const initialSubCounties = getSubCountiesForCounty(initialCounty);
  const initialSubCounty = initialSubCounties[0] || '';
  const initialWards = getWardsForSubCounty(initialCounty, initialSubCounty);
  const initialWard = initialWards[0] || '';

  const [county, setCounty] = useState(initialCounty);
  const [subCounty, setSubCounty] = useState(initialSubCounty);
  const [ward, setWard] = useState(initialWard);
  const [streetOrLandmark, setStreetOrLandmark] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  const [fullName, setFullName] = useState(authenticatedCitizen?.fullName || '');
  const [nationalId, setNationalId] = useState(authenticatedCitizen?.nationalId || '');
  const [email, setEmail] = useState(authenticatedCitizen?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(authenticatedCitizen?.phoneNumber || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [copied, setCopied] = useState(false);

  const smartTriage = calculateSmartSeverity(category, `${customOtherCategory} ${description}`);
  const priority = smartTriage.priority;

  const handleCategorySelect = (selectedCat: ServiceCategory) => {
    setCategory(selectedCat);
    if (selectedCat !== 'OTHER') {
      setTitle(CATEGORY_DEFAULT_HEADLINES[selectedCat]);
    } else {
      setTitle(customOtherCategory ? `Other Request: ${customOtherCategory}` : 'Public Community Service Request & Infrastructure Notice');
    }
  };

  const handleCustomOtherChange = (val: string) => {
    setCustomOtherCategory(val);
    if (val.trim()) {
      setTitle(`Public Request: ${val.trim()}`);
    } else {
      setTitle('Public Community Service Request & Infrastructure Notice');
    }
  };

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty);
    const availableSubCounties = getSubCountiesForCounty(newCounty);
    const newSubCounty = availableSubCounties[0] || '';
    setSubCounty(newSubCounty);
    const availableWards = getWardsForSubCounty(newCounty, newSubCounty);
    setWard(availableWards[0] || '');
  };

  const handleSubCountyChange = (newSubCounty: string) => {
    setSubCounty(newSubCounty);
    const availableWards = getWardsForSubCounty(county, newSubCounty);
    setWard(availableWards[0] || '');
  };

  const getCategoryIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'STREETLIGHT': return <Lightbulb className="w-5 h-5" />;
      case 'WATER': return <Droplet className="w-5 h-5" />;
      case 'GARBAGE': return <Trash2 className="w-5 h-5" />;
      case 'ROAD': return <AlertTriangle className="w-5 h-5" />;
      case 'SEWERAGE': return <Waves className="w-5 h-5" />;
      case 'PUBLIC_HEALTH': return <ShieldAlert className="w-5 h-5" />;
      case 'OTHER': return <HelpCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      setImageFile(null);
      setImagePreviewUrl('');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl('');
    setImageError('');
  };

  const generateReference = (selCounty: string): string => {
    const countyAbbr = selCounty.substring(0, 3).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `REQ-2026-${countyAbbr}-${randomPart}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticatedCitizen) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    const newErrors: Record<string, string> = {};

    const cleanTitle = sanitizeInput(title.trim());
    const cleanDesc = sanitizeInput(description.trim());
    const cleanStreet = sanitizeInput(streetOrLandmark.trim());
    const cleanName = sanitizeInput(fullName.trim());
    const cleanId = sanitizeInput(nationalId.trim());
    const cleanEmail = sanitizeInput(email.trim());
    const cleanPhone = sanitizeInput(phoneNumber.trim());

    if (category === 'OTHER' && !customOtherCategory.trim()) {
      newErrors.customOther = 'Please specify the service or issue type';
    }
    if (!cleanTitle) newErrors.title = 'Please provide an issue headline';
    if (!cleanDesc || cleanDesc.length < 15) newErrors.description = 'Please describe the incident in at least 15 characters';
    if (!cleanStreet) newErrors.streetOrLandmark = 'Please specify the street, building, or landmark';
    if (!cleanName) newErrors.fullName = 'Full legal name is required';
    if (!validateNationalId(cleanId)) newErrors.nationalId = 'Enter a valid Kenyan National ID (6 to 8 digits)';
    if (!validatePhoneNumber(cleanPhone)) newErrors.phoneNumber = 'Enter a valid Kenyan phone number (e.g. 0712345678)';
    if (!cleanEmail || !cleanEmail.includes('@')) newErrors.email = 'Valid email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const rateCheck = checkSubmissionRateLimit();
    if (!rateCheck.allowed) {
      setErrors({ form: `Rate Limit Exceeded: You have submitted too many requests recently. Please wait ${rateCheck.waitSeconds} seconds.` });
      return;
    }

    setIsSubmitting(true);

    const ref = generateReference(county);
    const catDef = getCategoryDefinition(category);
    const categoryLabel = category === 'OTHER' && customOtherCategory.trim()
      ? customOtherCategory.trim()
      : catDef.label;

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      referenceNumber: ref,
      category,
      categoryLabel,
      title: cleanTitle,
      description: cleanDesc,
      location: {
        county,
        subCounty,
        ward,
        streetOrLandmark: cleanStreet
      },
      priority,
      imageUrl: imagePreviewUrl || undefined,
      imageName: imageFile?.name || undefined,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicant: {
        fullName: cleanName,
        nationalId: cleanId,
        email: cleanEmail,
        phoneNumber: cleanPhone
      }
    };

    setTimeout(() => {
      onSubmitSuccess(newRequest);
      setSubmittedRequest(newRequest);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const copyTrackingCode = () => {
    if (!submittedRequest) return;
    navigator.clipboard.writeText(submittedRequest.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!authenticatedCitizen) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-gray-200 rounded-3xl shadow-sm p-8 sm:p-10 text-center font-lexend">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#006633] flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase font-bold tracking-wider text-[#008751] mb-2 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#006633]" />
          <span>Authentication &amp; Access Control Gate</span>
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Citizen Sign In Required
        </h2>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed max-w-md mx-auto">
          In compliance with Republic of Kenya eCitizen security and public accountability protocols, citizens must be authenticated with their National ID profile before submitting official public service requests.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-6 text-left text-xs space-y-2 text-gray-600">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#006633]" />
            <span>Why is authentication mandatory?</span>
          </div>
          <p>
            &bull; Direct tracking of municipal repair progress on your personal profile.
          </p>
          <p>
            &bull; Official verification of applicant contact for emergency field crew coordination.
          </p>
          <p>
            &bull; Protection against fraudulent or automated spam incident submissions.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onRequireAuth}
            className="px-6 py-3 rounded-3xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In / Register with National ID</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors"
          >
            Cancel &amp; Return Home
          </button>
        </div>
      </div>
    );
  }

  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-10 font-lexend">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#006633] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#006633]">
            Official Request Registered
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            Service Request Successfully Submitted
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Your municipal incident report has been registered into the {submittedRequest.location.county} County public administration tracking queue.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-center">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Official Tracking Reference Code
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-black text-gray-900 font-mono tracking-wider">
              {submittedRequest.referenceNumber}
            </span>
            <button
              type="button"
              onClick={copyTrackingCode}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Copy tracking code"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#006633]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Quote this code when tracking resolution progress or contacting county field operations.
          </p>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-6 mb-8 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Issue Headline:</span>
            <span className="font-bold text-gray-900">{submittedRequest.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Category:</span>
            <span>{submittedRequest.categoryLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Severity Determined:</span>
            <span className="font-bold text-emerald-800">{submittedRequest.priority} Priority</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Location:</span>
            <span>{submittedRequest.location.streetOrLandmark}, {submittedRequest.location.ward}, {submittedRequest.location.subCounty}, {submittedRequest.location.county}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Submitted By:</span>
            <span>{submittedRequest.applicant.fullName} (ID: {submittedRequest.applicant.nationalId})</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 mb-6 text-center">
          <p>
            Official Municipal and County administrators will track this case, assign rapid response crews, and update its resolution status (Pending &rarr; In Progress &rarr; Resolved).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => onNavigateTrack(submittedRequest.referenceNumber)}
            className="px-6 py-3 rounded-lg bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Clock className="w-4 h-4" />
            <span>Track Incident Status Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedRequest(null);
              setDescription('');
              setImageFile(null);
              setImagePreviewUrl('');
              setImageError('');
            }}
            className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Submit Another Request
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const currentSubCounties = getSubCountiesForCounty(county);
  const currentWards = getWardsForSubCounty(county, subCounty);

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-10 font-lexend">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
              Citizen Incident Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Submit Public Service Request
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Report municipal faults, infrastructure damage, and community hazards directly to county and state service departments.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#008751]" />
          <span>
            Authenticated Citizen Profile: <strong>{authenticatedCitizen.fullName}</strong> (National ID: {authenticatedCitizen.nationalId})
          </span>
        </div>
        <span className="hidden sm:inline-block text-emerald-800 font-bold text-xs">
          Verified eCitizen Session
        </span>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
            1. Select Incident / Service Category *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICE_CATEGORIES.map((cat) => {
              const selected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selected
                      ? 'border-[#008751] bg-[#008751]/5 ring-1 ring-[#008751]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selected ? 'bg-[#008751] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getCategoryIcon(cat.id)}
                    </div>
                    {selected && <CheckCircle2 className="w-4 h-4 text-[#008751]" />}
                  </div>
                  <span className="text-xs font-bold text-gray-900 block leading-snug">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </span>
                </button>
              );
            })}
          </div>

          {category === 'OTHER' && (
            <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-900">
                Specify Other Public Service Request Type *
              </label>
              <input
                type="text"
                value={customOtherCategory}
                onChange={(e) => handleCustomOtherChange(e.target.value)}
                placeholder="e.g. Fallen Tree, Park Maintenance, Noise Nuisance, Broken Culvert"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
              />
              {errors.customOther && <p className="text-xs text-red-600">{errors.customOther}</p>}
              <p className="text-[11px] text-gray-500">
                The eCitizen smart dispatch engine will automatically analyze and assign your request to the appropriate county department.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
              2. Issue Headline &amp; Description *
            </label>
            <span className="text-[11px] text-emerald-700 font-medium">
              (Auto-Populated from Category)
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Issue Headline (Automatically generated based on selection) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Faulty streetlight pole / Burst water pipe"
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Specific Problem Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact incident details: what is damaged, extent of hazard to the public, how long it has persisted..."
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            ></textarea>
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#008751]" />
                System-Determined Urgency &amp; Dispatch Routing
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                priority === 'EMERGENCY'
                  ? 'text-red-700'
                  : priority === 'HIGH'
                  ? 'text-amber-700'
                  : priority === 'MEDIUM'
                  ? 'text-blue-700'
                  : 'text-gray-700'
              }`}>
                {smartTriage.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Responsible Department:</span>
                <span className="font-bold text-gray-900">{smartTriage.department}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Target Response SLA:</span>
                <span className="font-bold text-gray-900">{smartTriage.estimatedResolutionDays} Business Day(s)</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>{smartTriage.reason}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
            3. Administrative Incident Location *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                County *
              </label>
              <select
                value={county}
                onChange={(e) => handleCountyChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#008751]"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c} County</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sub-County / Constituency *
              </label>
              <select
                value={subCounty}
                onChange={(e) => handleSubCountyChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#008751]"
              >
                {currentSubCounties.map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ward *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#008751]"
              >
                {currentWards.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Exact Street, Building, or Nearest Landmark *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={streetOrLandmark}
                onChange={(e) => setStreetOrLandmark(e.target.value)}
                placeholder="e.g. Along Kenyatta Avenue, near GPO post office junction"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#008751]"
              />
            </div>
            {errors.streetOrLandmark && <p className="text-xs text-red-600 mt-1">{errors.streetOrLandmark}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
            4. Photo Evidence (Optional)
          </label>
          <p className="text-xs text-gray-500">
            Attach an image showing the broken streetlight, water pipe, or garbage pile to assist dispatch teams (PNG, JPG up to 5MB).
          </p>

          {imagePreviewUrl ? (
            <div className="relative inline-block border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <img
                src={imagePreviewUrl}
                alt="Uploaded evidence"
                className="max-h-56 w-auto object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 hover:border-[#008751] rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-700">Click or drag image to upload evidence</span>
              <span className="text-[11px] text-gray-400 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          {imageError && <p className="text-xs text-red-600 mt-1">{imageError}</p>}
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
              5. Verified Citizen Contact Information
            </label>
            <span className="text-[11px] text-gray-500">
              Locked from authenticated session
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                value={fullName}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-700 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                National ID Number
              </label>
              <input
                type="text"
                readOnly
                value={nationalId}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-700 bg-gray-100 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#008751]"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#008751]"
              />
              {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-3xl bg-[#008751] hover:bg-[#007043] disabled:bg-gray-300 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <span>Registering Incident...</span>
            ) : (
              <>
                <span>Submit Service Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
