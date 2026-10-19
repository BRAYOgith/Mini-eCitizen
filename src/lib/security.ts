export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/\0/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/\0/g, '')
    .replace(/\.\.+[\\\/]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
}

export function validateNationalId(id: string): { valid: boolean; error?: string } {
  const sanitized = id.trim();
  if (!sanitized) {
    return { valid: false, error: 'National ID number is required' };
  }
  if (!/^\d{7,8}$/.test(sanitized)) {
    return { valid: false, error: 'National ID must be between 7 and 8 numeric digits with no letters or special characters' };
  }
  return { valid: true };
}

export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const sanitized = phone.trim();
  if (!sanitized) {
    return { valid: false, error: 'Phone number is required' };
  }
  const cleanPhone = sanitized.replace(/[\s-]/g, '');
  if (!/^(?:\+254|0)[17]\d{8}$/.test(cleanPhone)) {
    return { valid: false, error: 'Enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678)' };
  }
  return { valid: true };
}

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSizeBytes = 5 * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Unauthorized file type. Permitted formats: PDF, PNG, JPG, WEBP' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'File size exceeds maximum permitted threshold of 5MB' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Empty or corrupted file rejected' };
  }

  const suspiciousPatterns = /(\.exe|\.bat|\.cmd|\.sh|\.php|\.phtml|\.js|\.vbs|\.msi|\.jar|\.py|\.cgi|\.pl|\.dll|\.scr|\.bin)$/i;
  if (suspiciousPatterns.test(file.name)) {
    return { valid: false, error: 'Security Exception: Executable or scripted file extensions are forbidden' };
  }

  const fileNameParts = file.name.split('.');
  if (fileNameParts.length > 2) {
    for (let i = 1; i < fileNameParts.length - 1; i++) {
      if (suspiciousPatterns.test(`.${fileNameParts[i]}`)) {
        return { valid: false, error: 'Security Exception: Dangerous double-extension detected' };
      }
    }
  }

  return { valid: true };
}

export function generateSecureReference(agencyCode: string): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `ECZ-${agencyCode}-${year}-${randomPart}`;
}

export function generateCertificateNumber(agencyCode: string): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000000 + Math.random() * 9000000);
  return `CERT-KE-${agencyCode}-${year}-${randomPart}`;
}

export function computeSecurityChecksum(ref: string, nationalId: string, timestamp: string): string {
  const seedString = `${ref}:${nationalId}:${timestamp}:ECITIZEN_HMAC_KE_GOV_2026`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const positiveHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `SEC-HASH-${positiveHash}`;
}

export function verifySecurityChecksum(ref: string, nationalId: string, timestamp: string, providedHash: string): boolean {
  const expectedHash = computeSecurityChecksum(ref, nationalId, timestamp);
  return expectedHash === providedHash;
}

export function checkSubmissionRateLimit(): { allowed: boolean; waitSeconds?: number } {
  if (typeof window === 'undefined') return { allowed: true };
  const lastSubmissionKey = 'ecitizen_last_submission_time';
  const now = Date.now();
  const lastSubmission = localStorage.getItem(lastSubmissionKey);
  const cooldownPeriodMs = 3000;

  if (lastSubmission) {
    const elapsed = now - parseInt(lastSubmission, 10);
    if (elapsed < cooldownPeriodMs) {
      const waitSeconds = Math.ceil((cooldownPeriodMs - elapsed) / 1000);
      return { allowed: false, waitSeconds };
    }
  }

  localStorage.setItem(lastSubmissionKey, now.toString());
  return { allowed: true };
}

export interface PasswordStrength {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  color: string;
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  let criteriaMet = 0;
  if (hasMinLength) criteriaMet += 1;
  if (hasUpper) criteriaMet += 1;
  if (hasLower) criteriaMet += 1;
  if (hasNumber) criteriaMet += 1;
  if (hasSpecial) criteriaMet += 1;

  let label: PasswordStrength['label'] = 'Very Weak';
  let color = 'bg-red-500';

  if (criteriaMet <= 1) {
    label = 'Very Weak';
    color = 'bg-red-500';
  } else if (criteriaMet === 2) {
    label = 'Weak';
    color = 'bg-orange-500';
  } else if (criteriaMet === 3) {
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (criteriaMet === 4) {
    label = 'Strong';
    color = 'bg-blue-600';
  } else if (criteriaMet === 5) {
    label = 'Excellent';
    color = 'bg-[#008751]';
  }

  const isValid = hasMinLength && hasUpper && hasLower && hasNumber;

  return {
    score: (criteriaMet / 5) * 100,
    label,
    color,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid
  };
}

export interface LoginLockoutState {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 60;

export function checkLoginLockout(identifier = 'global'): LoginLockoutState {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }
  const cleanId = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'global';
  const attemptsKey = `ecitizen_auth_attempts_${cleanId}`;
  const lockoutKey = `ecitizen_auth_lockout_${cleanId}`;
  const now = Date.now();

  const lockoutUntil = localStorage.getItem(lockoutKey);
  if (lockoutUntil) {
    const lockTime = parseInt(lockoutUntil, 10);
    if (now < lockTime) {
      const remainingSeconds = Math.ceil((lockTime - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    } else {
      localStorage.removeItem(lockoutKey);
      localStorage.removeItem(attemptsKey);
    }
  }

  const attempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10);
  const attemptsLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - attempts);
  return { isLocked: false, remainingSeconds: 0, attemptsLeft };
}

export function recordFailedLogin(identifier = 'global'): LoginLockoutState {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }
  const cleanId = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'global';
  const attemptsKey = `ecitizen_auth_attempts_${cleanId}`;
  const lockoutKey = `ecitizen_auth_lockout_${cleanId}`;
  const now = Date.now();

  const attempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10) + 1;
  localStorage.setItem(attemptsKey, attempts.toString());

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lockUntil = now + (LOCKOUT_DURATION_SECONDS * 1000);
    localStorage.setItem(lockoutKey, lockUntil.toString());
    return { isLocked: true, remainingSeconds: LOCKOUT_DURATION_SECONDS, attemptsLeft: 0 };
  }

  return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS - attempts };
}

export function resetLoginAttempts(identifier = 'global'): void {
  if (typeof window === 'undefined') return;
  const cleanId = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'global';
  localStorage.removeItem(`ecitizen_auth_attempts_${cleanId}`);
  localStorage.removeItem(`ecitizen_auth_lockout_${cleanId}`);
}

export function recordLoginAttempt(success: boolean): { allowed: boolean; waitMinutes?: number } {
  if (typeof window === 'undefined') return { allowed: true };
  if (success) {
    resetLoginAttempts('global');
    return { allowed: true };
  }
  const status = recordFailedLogin('global');
  return { allowed: !status.isLocked, waitMinutes: Math.ceil(status.remainingSeconds / 60) };
}
