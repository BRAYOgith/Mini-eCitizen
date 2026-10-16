'use client';

import React, { useState } from 'react';
import { PublicService, ServiceRequest, CitizenBiodata } from '@/types';
import { KENYA_COUNTIES } from '@/lib/services-data';
import {
  sanitizeInput,
  validateNationalId,
  validatePhoneNumber,
  validateFileUpload,
  generateSecureReference,
  checkSubmissionRateLimit
} from '@/lib/security';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  Copy,
  Receipt
} from 'lucide-react';

interface ApplicationWizardProps {
  service: PublicService;
  onCancel: () => void;
  onSubmitSuccess: (newRequest: ServiceRequest) => void;
}

export default function ApplicationWizard({
  service,
  onCancel,
  onSubmitSuccess
}: ApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [biodata, setBiodata] = useState<CitizenBiodata>({
    nationalId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    county: 'Nairobi',
    subCounty: '',
    dateOfBirth: ''
  });

  const [serviceData, setServiceData] = useState<Record<string, string>>({});
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string>('');
  const [documentError, setDocumentError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState<ServiceRequest | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleBiodataChange = (field: keyof CitizenBiodata, value: string) => {
    setBiodata(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleServiceDataChange = (fieldId: string, value: string) => {
    setServiceData(prev => ({ ...prev, [fieldId]: value }));
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentError('');
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validation = validateFileUpload(file);

    if (!validation.valid) {
      setDocumentError(validation.error || 'Invalid file');
      setDocumentFile(null);
      setDocumentPreviewUrl('');
      return;
    }

    setDocumentFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setDocumentPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    const idCheck = validateNationalId(biodata.nationalId);
    if (!idCheck.valid) {
      errors.nationalId = idCheck.error!;
    }

    if (!biodata.fullName.trim() || biodata.fullName.trim().length < 3) {
      errors.fullName = 'Full legal name is required (minimum 3 characters)';
    }

    const phoneCheck = validatePhoneNumber(biodata.phoneNumber);
    if (!phoneCheck.valid) {
      errors.phoneNumber = phoneCheck.error!;
    }

    if (!biodata.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(biodata.email.trim())) {
      errors.email = 'Valid email address is required for official notifications';
    }

    if (!biodata.county) {
      errors.county = 'Please select your residential county';
    }

    if (!biodata.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    for (const field of service.serviceSpecificFields) {
      if (field.required && !serviceData[field.id]?.trim()) {
        errors[field.id] = `${field.label} is required`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    if (!documentFile) {
      setDocumentError(`Please upload the required document: ${service.requiredDocumentName}`);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handleFinalSubmission = () => {
    const rateLimit = checkSubmissionRateLimit();
    if (!rateLimit.allowed) {
      alert(`Anti-Spam Throttling: Please wait ${rateLimit.waitSeconds} seconds before submitting again.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const sanitizedBiodata: CitizenBiodata = {
        nationalId: sanitizeInput(biodata.nationalId),
        fullName: sanitizeInput(biodata.fullName),
        phoneNumber: sanitizeInput(biodata.phoneNumber),
        email: sanitizeInput(biodata.email),
        county: sanitizeInput(biodata.county),
        subCounty: sanitizeInput(biodata.subCounty || 'Central'),
        dateOfBirth: biodata.dateOfBirth
      };

      const sanitizedServiceData: Record<string, string> = {};
      for (const [key, value] of Object.entries(serviceData)) {
        sanitizedServiceData[key] = sanitizeInput(value);
      }

      const generatedRef = generateSecureReference(service.code);
      const timestamp = new Date().toISOString();

      const newRequest: ServiceRequest = {
        id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        referenceNumber: generatedRef,
        serviceId: service.id,
        serviceName: service.name,
        agencyCode: service.code,
        statutoryFee: service.statutoryFee,
        status: 'SUBMITTED',
        submittedAt: timestamp,
        updatedAt: timestamp,
        applicant: sanitizedBiodata,
        serviceData: sanitizedServiceData,
        documentName: documentFile?.name || 'document_attachment.pdf',
        documentDataUrl: documentPreviewUrl
      };

      setIsSubmitting(false);
      setSubmissionCompleted(newRequest);
      onSubmitSuccess(newRequest);
    }, 800);
  };

  const handleCopyReference = () => {
    if (submissionCompleted) {
      navigator.clipboard.writeText(submissionCompleted.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  if (submissionCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-md shadow-xs p-6 sm:p-8 my-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-[#006633]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Application Received Successfully
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Your request has been registered under {service.agencyName}.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase block">
                Official Reference Code
              </span>
              <span className="text-lg font-mono font-bold text-[#006633]">
                {submissionCompleted.referenceNumber}
              </span>
            </div>
            <button
              onClick={handleCopyReference}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {copiedRef ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500 block">Applicant</span>
              <span className="font-semibold text-gray-900">{submissionCompleted.applicant.fullName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">National ID</span>
              <span className="font-mono font-semibold text-gray-900">{submissionCompleted.applicant.nationalId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Statutory Fee</span>
              <span className="font-bold text-gray-900">KES {submissionCompleted.statutoryFee.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Status</span>
              <span className="font-semibold text-[#006633]">SUBMITTED & PAID</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-1/2 py-2 px-4 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Back to Services
          </button>
          <button
            onClick={() => onCancel()}
            className="w-full sm:w-1/2 py-2 px-4 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors text-center"
          >
            Track in Application Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-md shadow-xs my-6 overflow-hidden">
      <div className="bg-[#006633] text-white p-5 border-b-2 border-amber-400">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </button>
          <span className="text-xs font-mono text-emerald-200">
            Form Code: {service.code}-2026
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-200 uppercase font-semibold block">
              {service.agencyName}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {service.name}
            </h1>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-emerald-200 uppercase block font-semibold">
              Statutory Fee
            </span>
            <span className="text-lg sm:text-xl font-bold text-amber-300">
              KES {service.statutoryFee.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-5">
        <div className="flex divide-x divide-gray-200 text-xs font-semibold">
          {[
            { step: 1, title: '1. Applicant Biodata' },
            { step: 2, title: '2. Service Details' },
            { step: 3, title: '3. Document Upload' },
            { step: 4, title: '4. Summary' }
          ].map((item) => (
            <div
              key={item.step}
              className={`py-3 px-4 flex-1 text-center transition-colors ${
                currentStep === item.step
                  ? 'border-b-2 border-[#006633] text-[#006633] bg-white font-bold'
                  : currentStep > item.step
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-400 bg-gray-50'
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                Applicant Information
              </h2>
              <p className="text-xs text-gray-500">
                Provide national identification details as registered in Kenya civil records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  National ID Number *
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="32489120"
                  value={biodata.nationalId}
                  onChange={(e) => handleBiodataChange('nationalId', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
                {validationErrors.nationalId && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.nationalId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="Full name as on ID"
                  value={biodata.fullName}
                  onChange={(e) => handleBiodataChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
                {validationErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="07XXXXXXXX"
                  value={biodata.phoneNumber}
                  onChange={(e) => handleBiodataChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
                {validationErrors.phoneNumber && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={biodata.email}
                  onChange={(e) => handleBiodataChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  County of Residence *
                </label>
                <select
                  value={biodata.county}
                  onChange={(e) => handleBiodataChange('county', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                >
                  {KENYA_COUNTIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {validationErrors.county && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.county}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={biodata.dateOfBirth}
                  onChange={(e) => handleBiodataChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.dateOfBirth}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                Service Criteria Details
              </h2>
              <p className="text-xs text-gray-500">
                Specify operational options required for {service.name}.
              </p>
            </div>

            <div className="space-y-4">
              {service.serviceSpecificFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {field.label} {field.required && '*'}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={serviceData[field.id] || ''}
                      onChange={(e) => handleServiceDataChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                    >
                      <option value="">-- Select option --</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder || ''}
                      value={serviceData[field.id] || ''}
                      onChange={(e) => handleServiceDataChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                    />
                  )}

                  {validationErrors[field.id] && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                Supporting Document
              </h2>
              <p className="text-xs text-gray-500">
                Upload required verification document.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-700">
              <span className="font-semibold">Required:</span> {service.requiredDocumentName} (PDF, PNG, JPG - Max 5MB)
            </div>

            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-800">
                Attach document file here
              </p>
              <div className="mt-3">
                <label className="inline-block px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold cursor-pointer transition-colors">
                  <span>Browse Document</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileSelection}
                    className="hidden"
                  />
                </label>
              </div>

              {documentFile && (
                <div className="mt-4 p-3 bg-white border border-gray-300 rounded-md max-w-sm mx-auto text-left flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-[#006633] shrink-0" />
                    <span className="font-semibold text-gray-800 truncate">{documentFile.name}</span>
                  </div>
                  <span className="text-gray-500 text-[11px] shrink-0 ml-2">
                    {(documentFile.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              )}

              {documentError && (
                <p className="text-xs text-red-600 mt-3">{documentError}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                Confirm & Submit
              </h2>
              <p className="text-xs text-gray-500">
                Review your request details prior to electronic registration.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-900">{service.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold text-gray-900">{service.agencyName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Applicant:</span>
                <span className="font-semibold text-gray-900">{biodata.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">National ID:</span>
                <span className="font-mono font-semibold text-gray-900">{biodata.nationalId}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-gray-800">Statutory Fee:</span>
                <span className="text-[#006633]">KES {service.statutoryFee.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-1 px-5 py-2 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmission}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-md bg-[#006633] hover:bg-[#004d26] disabled:bg-gray-400 text-white text-xs font-semibold transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Request...' : 'Confirm & Submit'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
