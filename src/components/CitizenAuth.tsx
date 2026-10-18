'use client';

import React, { useState } from 'react';
import { CitizenAccount } from '@/types';
import { sanitizeInput, validateNationalId, recordLoginAttempt } from '@/lib/security';
import { KENYA_COUNTIES } from '@/lib/services-data';
import { saveRegisteredCitizen, getRegisteredCitizens } from '@/lib/storage';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';

interface CitizenAuthProps {
  initialMode?: 'login' | 'register';
  noticeMessage?: string;
  onAuthenticated: (citizen: CitizenAccount) => void;
  onCancel: () => void;
  onSwitchToOfficer?: () => void;
}

export default function CitizenAuth({
  initialMode = 'login',
  noticeMessage,
  onAuthenticated,
  onCancel,
  onSwitchToOfficer
}: CitizenAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const attemptCheck = recordLoginAttempt(false);
    if (!attemptCheck.allowed) {
      setErrorMessage(`Too many login attempts. Please wait ${attemptCheck.waitMinutes} minutes before retrying.`);
      return;
    }

    const cleanIdentifier = sanitizeInput(identifier.trim());
    if (!cleanIdentifier || !password.trim()) {
      setErrorMessage('Please provide both your National ID or Email and password.');
      return;
    }

    recordLoginAttempt(true);

    const registered = getRegisteredCitizens();
    const found = registered.find(
      c => c.nationalId.toLowerCase() === cleanIdentifier.toLowerCase() ||
           c.email.toLowerCase() === cleanIdentifier.toLowerCase()
    );

    if (found) {
      onAuthenticated(found);
      return;
    }

    const newCitizen: CitizenAccount = {
      id: `cit-${Date.now()}`,
      nationalId: cleanIdentifier.includes('@') ? '38491028' : cleanIdentifier,
      fullName: cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : `Citizen ${cleanIdentifier}`,
      email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@citizen.ke`,
      phoneNumber: '0712345678',
      county: 'Nairobi'
    };

    saveRegisteredCitizen(newCitizen);
    onAuthenticated(newCitizen);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanFullName = sanitizeInput(fullName.trim());
    const cleanId = sanitizeInput(nationalId.trim());
    const cleanEmail = sanitizeInput(email.trim());
    const cleanPhone = sanitizeInput(phoneNumber.trim());

    if (!cleanFullName || !cleanId || !cleanEmail || !cleanPhone || !password.trim()) {
      setErrorMessage('Please complete all registration fields.');
      return;
    }

    if (!validateNationalId(cleanId)) {
      setErrorMessage('Please enter a valid Kenyan National ID number (6 to 8 digits).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    recordLoginAttempt(true);

    const citizen: CitizenAccount = {
      id: `cit-${Date.now()}`,
      nationalId: cleanId,
      fullName: cleanFullName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      county: county
    };

    saveRegisteredCitizen(citizen);
    onAuthenticated(citizen);
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-8 font-lexend">
      <div className="text-center pb-5 border-b border-gray-100">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <img
            src="/coat-of-arms-kenya.svg"
            alt="Kenya Coat of Arms"
            className="h-10 w-auto object-contain"
          />
          <div className="h-7 w-px bg-gray-300"></div>
          <img
            src="/ecitizen-logo.png"
            alt="eCitizen Kenya"
            className="h-9 w-auto object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {mode === 'login' ? 'Citizen Sign In' : 'Citizen Registration'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Access all Government of Kenya digital services with one account
        </p>
      </div>

      {noticeMessage && (
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
          <span>{noticeMessage}</span>
        </div>
      )}

      <div className="flex border-b border-gray-200 mt-4 mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage('');
          }}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mode === 'login'
              ? 'border-[#008751] text-[#008751] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage('');
          }}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mode === 'register'
              ? 'border-[#008751] text-[#008751] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Create Citizen Account
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              National ID Number or Email Address
            </label>
            <input
              type="text"
              placeholder="e.g. 38491028 or citizen@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2.5 px-4 rounded-3xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 rounded-3xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-medium transition-colors shadow-xs"
            >
              Sign In
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Legal Name (as on ID)
            </label>
            <input
              type="text"
              placeholder="e.g. Brian Kiprono Mwangi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kenyan National ID Number
            </label>
            <input
              type="text"
              placeholder="e.g. 38491028"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              County of Residence
            </label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#008751]"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password (Min. 6 characters)
            </label>
            <input
              type="password"
              placeholder="Create secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2.5 px-4 rounded-3xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 rounded-3xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-medium transition-colors shadow-xs"
            >
              Register Account
            </button>
          </div>
        </form>
      )}

      {onSwitchToOfficer && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={onSwitchToOfficer}
            className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center space-x-1"
          >
            <span>Are you a Government Reviewing Officer?</span>
            <span className="text-emerald-700 font-semibold underline">Staff Portal</span>
          </button>
        </div>
      )}
    </div>
  );
}
