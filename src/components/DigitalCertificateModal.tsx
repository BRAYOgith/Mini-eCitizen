'use client';

import React from 'react';
import { ServiceRequest } from '@/types';
import {
  Printer,
  X,
  QrCode,
  ExternalLink
} from 'lucide-react';

interface DigitalCertificateModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onVerifyOnline: (refNumber: string) => void;
}

export default function DigitalCertificateModal({
  request,
  onClose,
  onVerifyOnline
}: DigitalCertificateModalProps) {
  const cert = request.certificate;
  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-md max-w-3xl w-full my-6 shadow-2xl border-2 border-gray-400 overflow-hidden print:m-0 print:border-none print:shadow-none">
        <div className="bg-[#1e293b] text-white px-5 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Official Electronic Certificate | eCitizen Portal
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-12 relative bg-white">
          <div className="text-center border-b-2 border-gray-800 pb-5 mb-6">
            <div className="w-12 h-12 mx-auto mb-2 bg-[#006633] rounded-sm flex items-center justify-center text-amber-300 font-serif font-black text-xl border border-[#004d26]">
              eC
            </div>

            <span className="text-xs font-bold tracking-widest uppercase text-gray-700 block mb-1">
              REPUBLIC OF KENYA
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 uppercase font-serif">
              {request.agencyCode === 'DCI' && 'Directorate of Criminal Investigations'}
              {request.agencyCode === 'NTSA' && 'National Transport and Safety Authority'}
              {request.agencyCode === 'BRS' && 'Business Registration Service'}
              {request.agencyCode === 'CRS' && 'Department of Civil Registration Services'}
              {request.agencyCode === 'IMMIGRATION' && 'Department of Immigration Services'}
            </h2>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
              eCitizen Electronic Credential Register
            </p>

            <div className="mt-3 inline-block bg-gray-900 text-white px-4 py-1">
              <span className="text-xs font-bold tracking-wider uppercase">
                {request.serviceName.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 p-3.5 border border-gray-200 mb-6 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">
                Certificate Serial
              </span>
              <span className="font-mono font-bold text-gray-900 text-xs">
                {cert.certificateNumber}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">
                Issue Date
              </span>
              <span className="font-semibold text-gray-800">
                {new Date(cert.issuedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">
                Validity
              </span>
              <span className="font-bold text-[#006633]">
                VERIFIED & VALID
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-gray-800 leading-relaxed mb-6">
            <p>
              This official certificate confirms that the citizen identified below has satisfied all regulatory standards under the Laws of Kenya:
            </p>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 border border-gray-200">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Full Name</span>
                <span className="font-bold text-gray-950">{request.applicant.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">National ID</span>
                <span className="font-mono font-bold text-gray-950">{request.applicant.nationalId}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">County of Registration</span>
                <span className="font-semibold text-gray-900">{request.applicant.county}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Reference Tracking Code</span>
                <span className="font-mono font-semibold text-gray-900">{request.referenceNumber}</span>
              </div>
            </div>

            <div className="border-l-2 border-[#006633] pl-3 py-1 bg-gray-50">
              <span className="font-semibold text-gray-900 block text-[11px]">
                Department Clearance Note:
              </span>
              <p className="text-gray-700 text-xs italic">
                {request.reviewRecord?.notes || 'Cleared and authorized for issuance.'}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1.5 border border-gray-400 flex flex-col items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-900" />
                <span className="text-[7px] font-mono text-gray-600">VERIFY</span>
              </div>
              <div className="text-[11px]">
                <span className="font-mono text-gray-900 font-bold block">
                  {cert.securityChecksum}
                </span>
                <span className="text-gray-500 block text-[10px]">
                  Cryptographic Hash
                </span>
                <button
                  onClick={() => onVerifyOnline(request.referenceNumber)}
                  className="mt-0.5 inline-flex items-center gap-1 text-[#006633] hover:underline font-semibold text-[10px] print:hidden"
                >
                  <span>Verify Authenticity Online</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="border-b border-gray-400 pb-1 mb-1 font-serif italic text-xs text-gray-800">
                {request.reviewRecord?.officerName || 'Registrar of Public Records'}
              </div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">
                Authorized Signatory
              </span>
              <span className="text-[9px] text-gray-400 block font-mono">
                Republic of Kenya Digital Directorate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
