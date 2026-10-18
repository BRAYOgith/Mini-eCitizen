'use client';

import React, { useState } from 'react';
import { Search, Globe, Accessibility, Lock, LogOut, Menu, X, Shield } from 'lucide-react';
import { OfficerAccount, CitizenAccount } from '@/types';

interface NavbarProps {
  currentView: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify' | 'citizen-auth' | 'national' | 'counties' | 'support';
  onNavigate: (view: 'catalog' | 'apply' | 'track' | 'officer' | 'officer-auth' | 'verify' | 'citizen-auth' | 'national' | 'counties' | 'support', authMode?: 'login' | 'register') => void;
  authenticatedCitizen: CitizenAccount | null;
  onCitizenSignOut: () => void;
  authenticatedOfficer: OfficerAccount | null;
  pendingRequestsCount: number;
  onSearchClick?: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  authenticatedCitizen,
  onCitizenSignOut,
  authenticatedOfficer,
  onSearchClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 font-lexend">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between gap-x-6 py-4 px-6 sm:px-8 lg:py-5" aria-label="Global">
        <div className="flex items-center overflow-hidden w-auto">
          <div
            onClick={() => onNavigate('catalog')}
            className="flex items-center cursor-pointer select-none"
            title="eCitizen Homepage"
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

        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-10">
          <button
            onClick={() => onNavigate('catalog')}
            className={`inline-flex items-center p-1 rounded-lg text-base transition-colors ${
              currentView === 'catalog'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('national')}
            className={`inline-flex items-center p-1 rounded-lg text-base transition-colors ${
              currentView === 'national'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            National
          </button>
          <button
            onClick={() => onNavigate('counties')}
            className={`inline-flex items-center p-1 rounded-lg text-base transition-colors ${
              currentView === 'counties'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Counties
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`inline-flex items-center p-1 rounded-lg text-base whitespace-nowrap transition-colors ${
              currentView === 'support'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Help &amp; Support
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onSearchClick}
            className="hidden lg:block text-base text-gray-500 hover:text-gray-900 rounded-full py-1.5 px-2.5 hover:bg-gray-100 transition-colors"
            title="Search name of service, category, department"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {authenticatedOfficer && (
            <button
              onClick={() => onNavigate('officer')}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-3xl border border-gray-300 text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Admin Console ({authenticatedOfficer.badgeNumber})</span>
            </button>
          )}

          {authenticatedCitizen ? (
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                {authenticatedCitizen.fullName}
              </span>
              <button
                onClick={onCitizenSignOut}
                className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex xl:items-center xl:space-x-3">
              <button
                onClick={() => onNavigate('citizen-auth', 'login')}
                className="rounded-3xl whitespace-nowrap border border-transparent text-sm bg-white py-2 px-4 font-medium text-gray-800 hover:bg-gray-100 focus:outline-hidden transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onNavigate('citizen-auth', 'register')}
                className="rounded-3xl whitespace-nowrap border border-transparent text-sm bg-[#008751] py-2 px-4 font-medium text-white shadow-xs hover:bg-[#007043] focus:outline-hidden transition-colors"
              >
                Register
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
              title="Choose Language"
              aria-label="Language Selector"
            >
              <Globe className="w-6 h-6" />
            </button>

            <button
              type="button"
              className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
              title="Accessibility Options"
              aria-label="Accessibility"
            >
              <Accessibility className="w-6 h-6" />
            </button>
          </div>

          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 rounded-md"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-6 py-5 space-y-4 font-lexend">
          <button
            onClick={() => {
              onNavigate('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('national');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            National
          </button>
          <button
            onClick={() => {
              onNavigate('counties');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Counties
          </button>
          <button
            onClick={() => {
              onNavigate('support');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Help &amp; Support
          </button>

          <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
            {authenticatedCitizen ? (
              <div className="flex items-center justify-between py-2 text-sm text-gray-800">
                <span>Signed in as <strong>{authenticatedCitizen.fullName}</strong></span>
                <button
                  onClick={() => {
                    onCitizenSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 items-center">
                <button
                  onClick={() => {
                    onNavigate('citizen-auth', 'login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center rounded-3xl whitespace-nowrap border border-gray-200 bg-white py-2 px-4 font-medium text-gray-800 shadow-xs hover:bg-gray-100 text-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    onNavigate('citizen-auth', 'register');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center rounded-3xl whitespace-nowrap border border-transparent bg-[#008751] py-2 px-4 font-medium text-white shadow-xs hover:bg-[#007043] text-sm"
                >
                  Register
                </button>
              </div>
            )}

            {authenticatedOfficer && (
              <button
                onClick={() => {
                  onNavigate('officer');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Admin Console ({authenticatedOfficer.badgeNumber})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
