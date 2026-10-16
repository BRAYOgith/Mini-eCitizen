import React from 'react';
import { PublicService } from '@/types';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  service: PublicService;
  onSelect: (service: PublicService) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md hover:border-[#006633] transition-colors flex flex-col justify-between shadow-2xs">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
          <span className="text-xs font-bold text-[#006633] uppercase tracking-wide">
            {service.agencyName}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            {service.processingTimeDays} Days
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">
          {service.name}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        <div className="space-y-1 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Prerequisites:
          </span>
          {service.requirements.slice(0, 2).map((req, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
              <span className="text-[#006633] font-bold">•</span>
              <span className="line-clamp-1">{req}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-gray-500 uppercase block font-semibold">
            Statutory Fee
          </span>
          <span className="text-sm font-bold text-gray-900">
            KES {service.statutoryFee.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onSelect(service)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
