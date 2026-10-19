'use client';

import React, { useState, useEffect } from 'react';
import { CitizenAccount } from '@/types';
import {
  sanitizeInput,
  validateNationalId,
  validatePhoneNumber,
  evaluatePasswordStrength,
  checkLoginLockout,
  recordFailedLogin,
  resetLoginAttempts
} from '@/lib/security';
import { KENYA_COUNTIES } from '@/lib/services-data';
import { saveRegisteredCitizen, getRegisteredCitizens } from '@/lib/storage';
import { ShieldCheck, ShieldAlert, Check, X, Lock, AlertTriangle, ArrowRight, User } from 'lucide-react';

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

  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  const passwordAnalysis = evaluatePasswordStrength(password);

  useEffect(() => {
    const status = checkLoginLockout(identifier || 'global_citizen');
    setLockoutSeconds(status.remainingSeconds);
    setAttemptsRemaining(status.attemptsLeft);
  }, [identifier]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const status = checkLoginLockout(identifier || 'global_citizen');
          setAttemptsRemaining(status.attemptsLeft);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds, identifier]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const lockoutStatus = checkLoginLockout(identifier || 'global_citizen');
    if (lockoutStatus.isLocked) {
      setLockoutSeconds(lockoutStatus.remainingSeconds);
      setErrorMessage(`Security Lockout Active: Too many failed login attempts. Please wait ${lockoutStatus.remainingSeconds} seconds.`);
      return;
    }

    const cleanIdentifier = sanitizeInput(identifier.trim());
    if (!cleanIdentifier || !password.trim()) {
      setErrorMessage('Please provide both your National ID or Email and password.');
      return;
    }

    const registered = getRegisteredCitizens();
    const found = registered.find(
      (c) =>
        c.nationalId.toLowerCase() === cleanIdentifier.toLowerCase() ||
        c.email.toLowerCase() === cleanIdentifier.toLowerCase()
    );

    if (!found) {
      const lockResult = recordFailedLogin(identifier || 'global_citizen');
      setLockoutSeconds(lockResult.remainingSeconds);
      setAttemptsRemaining(lockResult.attemptsLeft);

      if (lockResult.isLocked) {
        setErrorMessage(`Security Exception: 5 failed login attempts reached. Account login locked for ${lockResult.remainingSeconds} seconds.`);
      } else {
        setErrorMessage(`No citizen account found for "${cleanIdentifier}". Please click "Create Citizen Account" below to register. (${lockResult.attemptsLeft} attempts remaining).`);
      }
      return;
    }

    if (found.password && found.password !== password) {
      const lockResult = recordFailedLogin(identifier || 'global_citizen');
      setLockoutSeconds(lockResult.remainingSeconds);
      setAttemptsRemaining(lockResult.attemptsLeft);

      if (lockResult.isLocked) {
        setErrorMessage(`Security Exception: 5 failed login attempts reached. Form locked for ${lockResult.remainingSeconds} seconds.`);
      } else {
        setErrorMessage(`Incorrect password. Please verify your credentials. (${lockResult.attemptsLeft} attempts remaining before temporary lockout).`);
      }
      return;
    }

    resetLoginAttempts(identifier || 'global_citizen');
    onAuthenticated(found);
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

    const idCheck = validateNationalId(cleanId);
    if (!idCheck.valid) {
      setErrorMessage(idCheck.error || 'Please enter a valid Kenyan National ID (7 to 8 digits).');
      return;
    }

    const phoneCheck = validatePhoneNumber(cleanPhone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error || 'Please enter a valid Kenyan phone number (e.g. 0712345678).');
      return;
    }

    if (!passwordAnalysis.isValid) {
      setErrorMessage('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.');
      return;
    }

    const registered = getRegisteredCitizens();
    const alreadyExists = registered.some(
      (c) => c.nationalId === cleanId || c.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage('A citizen profile with this National ID or Email already exists. Please switch to Sign In.');
      return;
    }

    const citizen: CitizenAccount = {
      id: `cit-${Date.now()}`,
      nationalId: cleanId,
      fullName: cleanFullName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      county: county,
      password: password
    };

    saveRegisteredCitizen(citizen);
    resetLoginAttempts(cleanId);
    onAuthenticated(citizen);
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 font-lexend">
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
          Access Republic of Kenya digital municipal and public services
        </p>
      </div>

      {noticeMessage && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {isLocked && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Security Lockout Active</strong>
            <p className="mt-0.5 text-red-800 leading-relaxed">
              Too many consecutive failed login attempts. For security protection against unauthorized access, authentication is blocked.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 border border-red-300 rounded-md font-mono font-bold text-red-900">
              <Lock className="w-3.5 h-3.5" />
              <span>Retry permitted in: {lockoutSeconds}s</span>
            </div>
          </div>
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

      {errorMessage && !isLocked && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
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
              disabled={isLocked}
              placeholder="e.g. 38491028 or citizen@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              disabled={isLocked}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {attemptsRemaining < 5 && !isLocked && (
            <div className="text-[11px] text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{attemptsRemaining} login attempts remaining before temporary lockout.</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-[#008751] hover:bg-[#007043] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors shadow-xs"
            >
              {isLocked ? 'Blocked' : 'Sign In'}
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
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kenyan National ID Number (7-8 digits)
            </label>
            <input
              type="text"
              placeholder="e.g. 38491028"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
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
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
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
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
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
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:outline-hidden focus:border-[#008751]"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">
                Create Account Password
              </label>
              {password && (
                <span className="text-[11px] font-semibold text-gray-700">
                  Strength: <strong className="text-gray-900">{passwordAnalysis.label}</strong>
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-hidden focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
            />

            {password && (
              <div className="mt-2 space-y-2">
                <div className="w-full bg-gray-200 rounded-sm h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 transition-all duration-300 ${passwordAnalysis.color}`}
                    style={{ width: `${passwordAnalysis.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-600 pt-1">
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasUpper ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasLower ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Special character (!@#)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-medium transition-colors shadow-xs"
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
