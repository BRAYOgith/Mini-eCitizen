'use client';

import React, { useState, useEffect } from 'react';
import { OfficerAccount } from '@/types';
import {
  sanitizeInput,
  evaluatePasswordStrength,
  checkLoginLockout,
  recordFailedLogin,
  resetLoginAttempts
} from '@/lib/security';
import { getRegisteredOfficers, saveRegisteredOfficer } from '@/lib/storage';
import { Lock, ShieldAlert, Check, X, AlertTriangle } from 'lucide-react';

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
  const [department, setDepartment] = useState('County Public Works & Infrastructure');
  const [errorMessage, setErrorMessage] = useState('');

  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  const passwordAnalysis = evaluatePasswordStrength(password);

  useEffect(() => {
    const status = checkLoginLockout(badgeNumber || 'global_officer');
    setLockoutSeconds(status.remainingSeconds);
    setAttemptsRemaining(status.attemptsLeft);
  }, [badgeNumber]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const status = checkLoginLockout(badgeNumber || 'global_officer');
          setAttemptsRemaining(status.attemptsLeft);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds, badgeNumber]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const lockoutStatus = checkLoginLockout(badgeNumber || 'global_officer');
    if (lockoutStatus.isLocked) {
      setLockoutSeconds(lockoutStatus.remainingSeconds);
      setErrorMessage(`Security Lockout Active: Too many failed login attempts. Please wait ${lockoutStatus.remainingSeconds} seconds.`);
      return;
    }

    const cleanBadge = sanitizeInput(badgeNumber.trim());
    if (!cleanBadge || !password.trim()) {
      setErrorMessage('Please enter both your Officer Badge Number / Email and Password.');
      return;
    }

    const registered = getRegisteredOfficers();
    const found = registered.find(
      (o) =>
        o.badgeNumber.toLowerCase() === cleanBadge.toLowerCase() ||
        o.email.toLowerCase() === cleanBadge.toLowerCase()
    );

    if (!found) {
      const lockResult = recordFailedLogin(badgeNumber || 'global_officer');
      setLockoutSeconds(lockResult.remainingSeconds);
      setAttemptsRemaining(lockResult.attemptsLeft);

      if (lockResult.isLocked) {
        setErrorMessage(`Security Exception: 5 failed attempts reached. Officer access locked for ${lockResult.remainingSeconds} seconds.`);
      } else {
        setErrorMessage(`No officer account found for "${cleanBadge}". Please register your official officer credentials first. (${lockResult.attemptsLeft} attempts remaining).`);
      }
      return;
    }

    if (found.password && found.password !== password) {
      const lockResult = recordFailedLogin(badgeNumber || 'global_officer');
      setLockoutSeconds(lockResult.remainingSeconds);
      setAttemptsRemaining(lockResult.attemptsLeft);

      if (lockResult.isLocked) {
        setErrorMessage(`Security Exception: 5 failed attempts reached. Form locked for ${lockResult.remainingSeconds} seconds.`);
      } else {
        setErrorMessage(`Incorrect officer password. Please verify your credentials. (${lockResult.attemptsLeft} attempts remaining before temporary lockout).`);
      }
      return;
    }

    resetLoginAttempts(badgeNumber || 'global_officer');
    onAuthenticated(found);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanFullName = sanitizeInput(fullName.trim());
    const cleanBadge = sanitizeInput(badgeNumber.trim());
    const cleanEmail = sanitizeInput(email.trim());

    if (!cleanFullName || !cleanBadge || !cleanEmail || !password.trim()) {
      setErrorMessage('All official registration fields are required.');
      return;
    }

    if (!passwordAnalysis.isValid) {
      setErrorMessage('Security policy requires officer passwords to be at least 8 characters with uppercase, lowercase, and numbers.');
      return;
    }

    const registered = getRegisteredOfficers();
    const alreadyExists = registered.some(
      (o) =>
        o.badgeNumber.toLowerCase() === cleanBadge.toLowerCase() ||
        o.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage('An officer profile with this Badge Number or Email is already registered. Please sign in.');
      return;
    }

    const officer: OfficerAccount = {
      id: `off-${Date.now()}`,
      badgeNumber: cleanBadge,
      fullName: cleanFullName,
      email: cleanEmail,
      department: department,
      role: 'County Municipal Administrator',
      password: password
    };

    saveRegisteredOfficer(officer);
    resetLoginAttempts(cleanBadge);
    onAuthenticated(officer);
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="max-w-md mx-auto my-10 bg-white border border-gray-300 rounded-xl shadow-xs p-6 font-lexend">
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
          Restricted to authorized municipal and public works officers
        </p>
      </div>

      {isLocked && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Security Lockout Active</strong>
            <p className="mt-0.5 text-red-800 leading-relaxed">
              Too many failed officer login attempts detected. Access is temporarily locked.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 border border-red-300 rounded-md font-mono font-bold text-red-900">
              <Lock className="w-3.5 h-3.5" />
              <span>Retry permitted in: {lockoutSeconds}s</span>
            </div>
          </div>
        </div>
      )}

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

      {errorMessage && !isLocked && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
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
              disabled={isLocked}
              placeholder="e.g. SEC-OPS-01 or officer@nairobi.go.ke"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              disabled={isLocked}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {attemptsRemaining < 5 && !isLocked && (
            <div className="text-[11px] text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{attemptsRemaining} attempts remaining before temporary lockout.</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="w-1/2 py-2 px-3 rounded-lg bg-[#006633] hover:bg-[#004d26] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
            >
              {isLocked ? 'Blocked' : 'Authenticate & Enter'}
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
              placeholder="e.g. Officer Grace A. Mutua"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service / Badge Number
            </label>
            <input
              type="text"
              placeholder="e.g. SEC-OPS-01 or POL-4829"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              County Department / Response Division
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 bg-white focus:outline-hidden focus:border-[#006633]"
            >
              <option value="County Public Works & Infrastructure">County Public Works &amp; Infrastructure</option>
              <option value="Water & Sewerage Services Company">Water &amp; Sewerage Services Company</option>
              <option value="Environment & Solid Waste Directorate">Environment &amp; Solid Waste Directorate</option>
              <option value="Roads, Transport & Bridges Division">Roads, Transport &amp; Bridges Division</option>
              <option value="Public Health & Safety Inspection">Public Health &amp; Safety Inspection</option>
              <option value="Emergency Response & Disaster Management">Emergency Response &amp; Disaster Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Official Government Email
            </label>
            <input
              type="email"
              placeholder="officer@county.go.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Access Password
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
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
            />

            {password && (
              <div className="mt-2 space-y-1.5">
                <div className="w-full bg-gray-200 rounded-sm h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 transition-all duration-300 ${passwordAnalysis.color}`}
                    style={{ width: `${passwordAnalysis.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1 h-1 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasUpper ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasUpper ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1 h-1 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasLower ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1 h-1 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordAnalysis.hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                    {passwordAnalysis.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1 h-1 rounded-sm bg-gray-300 mx-1"></span>}
                    <span>Number (0-9)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-3 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white text-xs font-semibold transition-colors"
            >
              Register &amp; Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
