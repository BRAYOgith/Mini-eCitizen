'use client';

import React, { useState } from 'react';
import { OfficerAccount } from '@/types';
import { sanitizeInput, recordLoginAttempt } from '@/lib/security';
import { Lock } from 'lucide-react';

interface OfficerAuthProps {
  onAuthenticated: (officer: OfficerAccount) => void;
  onCancel: () => void;
}

export default function OfficerAuth({ onAuthenticated, onCancel }: OfficerAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Directorate of Criminal Investigations (DCI)');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const attemptCheck = recordLoginAttempt(false);
    if (!attemptCheck.allowed) {
      setErrorMessage(`Security Lockout: Too many failed login attempts. Please wait ${attemptCheck.waitMinutes} minutes before trying again.`);
      return;
    }

    if (!badgeNumber.trim() || !password.trim()) {
      setErrorMessage('Please enter both your Officer Badge Number / Email and Password.');
      return;
    }

    recordLoginAttempt(true);

    const officer: OfficerAccount = {
      id: `off-${Date.now()}`,
      badgeNumber: sanitizeInput(badgeNumber.trim()),
      fullName: badgeNumber.includes('@') ? badgeNumber.split('@')[0] : `Officer ${badgeNumber}`,
      email: badgeNumber.includes('@') ? badgeNumber : `${badgeNumber.toLowerCase()}@ecitizen.go.ke`,
      department: 'Government Clearance Registry',
      role: 'Reviewing Clearance Officer'
    };

    onAuthenticated(officer);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !badgeNumber.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('All official registration fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Security policy requires officer passwords to be at least 6 characters in length.');
      return;
    }

    recordLoginAttempt(true);

    const officer: OfficerAccount = {
      id: `off-${Date.now()}`,
      badgeNumber: sanitizeInput(badgeNumber.trim()),
      fullName: sanitizeInput(fullName.trim()),
      email: sanitizeInput(email.trim()),
      department: department,
      role: 'Authorized Public Officer'
    };

    onAuthenticated(officer);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white border border-gray-300 rounded-md shadow-xs p-6">
      <div className="border-b border-gray-200 pb-3 mb-5 text-center">
        <img
          src="/ecitizen-logo.png"
          alt="eCitizen Kenya"
          className="h-12 w-auto mx-auto mb-2 object-contain"
        />
        <h2 className="text-base font-bold text-gray-900">
          Government Officer Authentication
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Restricted to authorized public officers under the Laws of Kenya
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            mode === 'login'
              ? 'border-[#006633] text-[#006633] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Officer Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            mode === 'register'
              ? 'border-[#006633] text-[#006633] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Register Officer Account
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Officer Badge Number or Official Email
            </label>
            <input
              type="text"
              placeholder="e.g. POL-4829 or officer@dci.go.ke"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2 px-3 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-3 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
            >
              Authenticate & Enter
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Official Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Inspector Grace A. Mutua"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service / Badge Number
            </label>
            <input
              type="text"
              placeholder="e.g. DCI-94182"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#006633]"
            >
              <option value="Directorate of Criminal Investigations (DCI)">Directorate of Criminal Investigations (DCI)</option>
              <option value="National Transport and Safety Authority (NTSA)">National Transport and Safety Authority (NTSA)</option>
              <option value="Business Registration Service (BRS)">Business Registration Service (BRS)</option>
              <option value="Department of Civil Registration (CRS)">Department of Civil Registration (CRS)</option>
              <option value="Department of Immigration Services">Department of Immigration Services</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              placeholder="officer@department.go.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Access Password (Min. 6 chars)
            </label>
            <input
              type="password"
              placeholder="Create secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2 px-3 rounded-md border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-3 rounded-md bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
            >
              Register & Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
