'use client';

import React from 'react';
import { PublicService } from '@/types';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: PublicService;
  onSelect: (service: PublicService) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div
      onClick={() => onSelect(service)}
      className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="h-14 w-auto flex items-center">
            <img
              src={service.logoUrl}
              alt={service.agencyName}
              className="max-h-12 max-w-[140px] object-contain"
            />
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 mt-1" />
        </div>

        <h3 className="text-base font-semibold text-gray-900 mt-5 mb-2 leading-snug group-hover:text-[#008751] transition-colors">
          {service.agencyName}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700">
          {service.name}
        </span>
        <span className="text-[#008751] font-semibold inline-flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
