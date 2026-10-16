'use client';

import React, { useState } from 'react';
import { Search, Globe, Accessibility, Trash2, Lock, User, Menu, X } from 'lucide-react';
import { OfficerAccount } from '@/types';

interface NavbarProps {
  currentView: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify';
  onNavigate: (view: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify') => void;
  authenticatedOfficer: OfficerAccount | null;
  onClearData: () => void;
  pendingRequestsCount: number;
  onSearchClick?: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  authenticatedOfficer,
  onClearData,
  pendingRequestsCount,
  onSearchClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOfficerClick = () => {
    if (authenticatedOfficer) {
      onNavigate('officer');
    } else {
      onNavigate('officer-auth');
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 font-lexend">
      <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div
              onClick={() => onNavigate('catalog')}
              className="flex items-center cursor-pointer select-none"
            >
              <img
                src="/coat-of-arms-kenya.svg"
                alt="Republic of Kenya Coat of Arms"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="h-8 w-px bg-gray-300 mx-3 sm:mx-4"></div>
              <img
                src="/ecitizen-logo.png"
                alt="eCitizen Kenya"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('catalog')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'catalog'
                  ? 'text-gray-950 font-semibold'
                  : 'text-gray-700 hover:text-gray-950'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
            >
              National
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
            >
              Counties
            </button>
            <button
              onClick={() => onNavigate('track')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'track'
                  ? 'text-gray-950 font-semibold'
                  : 'text-gray-700 hover:text-gray-950'
              }`}
            >
              Track Application
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'verify'
                  ? 'text-gray-950 font-semibold'
                  : 'text-gray-700 hover:text-gray-950'
              }`}
            >
              Verify Document
            </button>
          </nav>

          <div className="hidden sm:flex items-center space-x-3">
            <button
              type="button"
              onClick={onSearchClick}
              className="p-2 text-gray-700 hover:text-gray-950 rounded-full hover:bg-gray-100 transition-colors"
              title="Search Services"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {authenticatedOfficer ? (
              <button
                onClick={handleOfficerClick}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-3xl border border-gray-300 text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Console ({authenticatedOfficer.badgeNumber})</span>
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleOfficerClick}
                className="text-sm font-medium text-gray-800 hover:text-gray-950 px-3 py-2 transition-colors"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => {
                if (!authenticatedOfficer) {
                  onNavigate('officer-auth');
                } else {
                  onNavigate('officer');
                }
              }}
              className="rounded-3xl bg-[#008751] hover:bg-[#007043] text-white px-5 py-2 text-sm font-medium shadow-xs transition-colors"
            >
              Register
            </button>

            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
              title="Change Language"
              aria-label="Language Selector"
            >
              <Globe className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
              title="Accessibility Options"
              aria-label="Accessibility"
            >
              <Accessibility className="w-5 h-5" />
            </button>

            <button
              onClick={onClearData}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors ml-1"
              title="Reset Applications (Empty Database)"
              aria-label="Clear Data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigate('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-900"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('track');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-700"
          >
            Track Application
          </button>
          <button
            onClick={() => {
              onNavigate('verify');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-700"
          >
            Verify Document
          </button>
          <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
            <button
              onClick={() => {
                handleOfficerClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-3xl border border-gray-300 text-sm font-medium text-gray-800"
            >
              {authenticatedOfficer ? `Officer Console (${authenticatedOfficer.badgeNumber})` : 'Sign in'}
            </button>
            <button
              onClick={() => {
                onNavigate('officer-auth');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-3xl bg-[#008751] text-white text-sm font-medium"
            >
              Register
            </button>
            <button
              onClick={() => {
                onClearData();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 text-xs text-red-600 hover:text-red-700 flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Applications</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
