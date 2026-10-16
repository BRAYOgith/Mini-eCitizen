'use client';

import React from 'react';
import { User, Lock, Trash2 } from 'lucide-react';
import { OfficerAccount } from '@/types';

interface NavbarProps {
  currentView: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify';
  onNavigate: (view: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify') => void;
  authenticatedOfficer: OfficerAccount | null;
  onClearData: () => void;
  pendingRequestsCount: number;
}

export default function Navbar({
  currentView,
  onNavigate,
  authenticatedOfficer,
  onClearData,
  pendingRequestsCount
}: NavbarProps) {
  const handleOfficerClick = () => {
    if (authenticatedOfficer) {
      onNavigate('officer');
    } else {
      onNavigate('officer-auth');
    }
  };

  return (
    <>
      <div className="bg-[#1a202c] text-gray-300 text-[12px] py-1 px-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wider text-[11px]">
              REPUBLIC OF KENYA
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300">An official Government of Kenya portal</span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <div className="hidden sm:flex items-center gap-1.5 text-gray-300 border-r border-gray-600 pr-3">
              <span className="text-gray-400">Text Size:</span>
              <button type="button" className="hover:text-white px-1">A-</button>
              <button type="button" className="hover:text-white px-1 font-bold">A</button>
              <button type="button" className="hover:text-white px-1 font-bold text-[13px]">A+</button>
            </div>

            <button
              onClick={onClearData}
              className="text-gray-300 hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Clear all stored applications"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Applications</span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-black"></div>
        <div className="h-full w-1/3 bg-[#bb0000]"></div>
        <div className="h-full w-1/3 bg-[#006633]"></div>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-sm bg-[#006633] flex items-center justify-center text-white border border-[#004d26] shrink-0">
                <span className="font-serif font-black text-xl text-amber-300">eC</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0f172a] tracking-tight">
                    e<span className="text-[#006633]">Citizen</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 tracking-wider uppercase font-semibold">
                  Gateway to All Government Services
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('catalog')}
                className={`py-6 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
                  currentView === 'catalog'
                    ? 'border-[#006633] text-[#006633]'
                    : 'border-transparent text-gray-700 hover:text-[#006633]'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => onNavigate('track')}
                className={`py-6 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
                  currentView === 'track'
                    ? 'border-[#006633] text-[#006633]'
                    : 'border-transparent text-gray-700 hover:text-[#006633]'
                }`}
              >
                Track Application
              </button>
              <button
                onClick={() => onNavigate('verify')}
                className={`py-6 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
                  currentView === 'verify'
                    ? 'border-[#006633] text-[#006633]'
                    : 'border-transparent text-gray-700 hover:text-[#006633]'
                }`}
              >
                Verify Document
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOfficerClick}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md border transition-colors ${
                  authenticatedOfficer
                    ? 'bg-[#1e293b] text-white border-gray-700'
                    : 'bg-[#006633] text-white hover:bg-[#004d26] border-[#004d26]'
                }`}
              >
                {authenticatedOfficer ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Officer Console ({authenticatedOfficer.badgeNumber})</span>
                    {pendingRequestsCount > 0 && (
                      <span className="ml-1 bg-white text-gray-900 text-[11px] px-1.5 py-0.2 rounded-xs font-bold">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Officer Login</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden flex border-t border-gray-200 divide-x divide-gray-200 text-center text-xs">
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex-1 py-3 font-semibold ${
              currentView === 'catalog' ? 'text-[#006633] bg-gray-50' : 'text-gray-700'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onNavigate('track')}
            className={`flex-1 py-3 font-semibold ${
              currentView === 'track' ? 'text-[#006633] bg-gray-50' : 'text-gray-700'
            }`}
          >
            Track
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className={`flex-1 py-3 font-semibold ${
              currentView === 'verify' ? 'text-[#006633] bg-gray-50' : 'text-gray-700'
            }`}
          >
            Verify
          </button>
        </div>
      </header>
    </>
  );
}
