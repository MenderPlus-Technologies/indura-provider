'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useResetPasswordMutation, useForgotPasswordMutation } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

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

const RESEND_COOLDOWN_SEC = 60;

export const ResetPasswordScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  const emailFromQuery = searchParams.get('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ otp: false, new: false, confirm: false });
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (emailFromQuery) {
      try {
        setEmail(decodeURIComponent(emailFromQuery));
      } catch {
        setEmail(emailFromQuery);
      }
    }
  }, [emailFromQuery]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const strengthResult = useMemo(
    () => (newPassword ? validatePasswordStrength(newPassword) : null),
    [newPassword]
  );

  const otpError = touched.otp && !otp.trim() ? 'One-time code is required' : null;
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
    setTouched({ otp: true, new: true, confirm: true });

    if (!email.trim()) {
      setError('Email is required. Please use the link from your email or go back and enter your email.');
      return;
    }
    if (!otp.trim()) {
      setError('Please enter the one-time code from your email.');
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

    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();
      showToast(
        'Password reset successfully. Please log in with your new password.',
        'success',
        6000
      );
      router.replace('/');
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        'Password reset failed. Please try again.';
      setError(message);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email.trim()) return;
    setError(null);
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setResendCooldown(RESEND_COOLDOWN_SEC);
      showToast('A new code has been sent to your email.', 'success', 4000);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        'Failed to resend code. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
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

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              We&apos;ve sent a one-time code to your email. Enter it below along with your new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-12 pr-4 h-12 bg-gray-100 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="otp"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                One-Time Code (OTP)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 8));
                    setTouched((t) => ({ ...t, otp: true }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, otp: true }))}
                  className={`w-full pl-12 pr-4 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white ${
                    otpError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter code from email"
                  disabled={isResetting}
                  required
                />
              </div>
              {otpError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{otpError}</p>
              )}
            </div>

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
                  disabled={isResetting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isResetting}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Min 8 characters, one uppercase letter, one number, one special character
              </p>
              {newError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{newError}</p>
              )}
            </div>

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
                  disabled={isResetting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isResetting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{confirmError}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                isResetting ||
                !email.trim() ||
                !otp.trim() ||
                !newPassword.trim() ||
                !confirmPassword.trim()
              }
              className="w-full h-12 bg-[#009688] hover:bg-[#008577] text-white font-semibold rounded-lg cursor-pointer"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending || !email.trim()}
                className="font-medium text-[#009688] dark:text-teal-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : isResending
                  ? 'Sending...'
                  : 'Resend Code'}
              </button>
            </p>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#009688] dark:text-teal-400 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
