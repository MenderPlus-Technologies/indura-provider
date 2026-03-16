'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/auth-context';
import { useToast } from '@/components/ui/toast';

/** New password strength: min 8 chars, uppercase, number, special character */
function validatePasswordStrength(
  pwd: string
): { valid: boolean; message?: string } {
  if (pwd.length < 8) {
    return { valid: false, message: 'At least 8 characters' };
  }
  if (!/[A-Z]/.test(pwd)) {
    return { valid: false, message: 'At least one uppercase letter' };
  }
  if (!/[0-9]/.test(pwd)) {
    return { valid: false, message: 'At least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return { valid: false, message: 'At least one special character' };
  }
  return { valid: true };
}

export const ChangePasswordScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { changePassword, signOut, requiresPasswordChange, isChangingPassword } =
    useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, temp: false, new: false, confirm: false });

  // Pre-fill temporary password from ?token= (e.g. from email link)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && typeof token === 'string') {
      try {
        setTemporaryPassword(decodeURIComponent(token));
      } catch {
        setTemporaryPassword(token);
      }
    }
  }, [searchParams]);

  // Redirect only when logged in and password change is NOT required (already changed)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('authToken');
    const requiresChange =
      localStorage.getItem('requiresPasswordChange') === 'true';

    if (token && !requiresChange && !requiresPasswordChange) {
      router.replace('/dashboard');
    }
  }, [router, requiresPasswordChange]);

  const strengthResult = useMemo(
    () => (newPassword ? validatePasswordStrength(newPassword) : null),
    [newPassword]
  );

  const emailError =
    touched.email && !email.trim() ? 'Email is required' : null;

  const tempError =
    touched.temp && !temporaryPassword.trim()
      ? 'Temporary password is required'
      : null;
  const newError =
    touched.new && newPassword
      ? strengthResult && !strengthResult.valid
        ? strengthResult.message
        : null
      : null;
  const confirmError =
    touched.confirm && confirmPassword && newPassword !== confirmPassword
      ? 'Passwords do not match'
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ email: true, temp: true, new: true, confirm: true });

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!temporaryPassword.trim()) {
      setError('Please enter your temporary password.');
      return;
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      setError(`New password must meet requirements: ${strength.message}.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (temporaryPassword === newPassword) {
      setError('New password cannot be the same as your temporary password.');
      return;
    }

    const result = await changePassword(email.trim(), temporaryPassword, newPassword);

    if (!result.success) {
      setError(result.error || 'Password change failed. Please try again.');
      return;
    }

    signOut();
    showToast(
      'Password changed successfully. Please log in with your new password.',
      'success',
      6000
    );
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header with Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <Image
            className="w-8 h-8"
            alt="Indura logo"
            src="https://res.cloudinary.com/dcxdrsgjs/image/upload/v1762925839/Group_phh0r8.svg"
            width={32}
            height={32}
          />
          <span className="text-[#009688] font-bold text-xl">Indura</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Change Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Welcome! For your security, please change the temporary password
              sent to your email before continuing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched((t) => ({ ...t, email: true }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`w-full px-4 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white ${
                    emailError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  disabled={isChangingPassword}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Temporary Password Field */}
            <div>
              <Label
                htmlFor="temporaryPassword"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                Temporary Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="temporaryPassword"
                  type={showTemporaryPassword ? 'text' : 'password'}
                  value={temporaryPassword}
                  onChange={(e) => {
                    setTemporaryPassword(e.target.value);
                    setTouched((t) => ({ ...t, temp: true }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, temp: true }))}
                  className={`w-full pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white ${
                    tempError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter the password from your email"
                  disabled={isChangingPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowTemporaryPassword(!showTemporaryPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isChangingPassword}
                >
                  {showTemporaryPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {tempError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {tempError}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                New Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setTouched((t) => ({ ...t, new: true }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, new: true }))}
                  className={`w-full pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white ${
                    newError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter your new password"
                  disabled={isChangingPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isChangingPassword}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Min 8 characters, one uppercase letter, one number, one special
                character
              </p>
              {newError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {newError}
                </p>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setTouched((t) => ({ ...t, confirm: true }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  className={`w-full pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white ${
                    confirmError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Confirm your new password"
                  disabled={isChangingPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isChangingPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {confirmError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isChangingPassword ||
                !temporaryPassword.trim() ||
                !newPassword.trim() ||
                !confirmPassword.trim()
              }
              className="w-full h-12 bg-[#009688] hover:bg-[#008577] text-white font-semibold rounded-lg cursor-pointer"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Changing password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
