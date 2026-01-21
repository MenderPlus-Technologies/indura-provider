'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Key, Eye, EyeOff, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/auth-context';

export const SignInScreen = () => {
  const router = useRouter();
  const { signIn, isSigningIn } = useAuth();
  const [email, setEmail] = useState('devonlane@mail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in email and password');
      return;
    }

    const result = await signIn(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Sign in failed. Please try again.');
      return;
    }

    // Store legacy login state if "Keep me logged in" is checked
    if (keepLoggedIn && typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }

    // Get user data for role-based redirect
    const user = result.user;
    if (!user) {
      // Fallback: read from localStorage if user not in result
      const userStr = localStorage.getItem('authUser');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          if (parsedUser) {
            // Use parsed user for redirect logic
            const userRole = parsedUser.role;
            
            // Check if password change is required
            const requiresPasswordChange = localStorage.getItem('requiresPasswordChange') === 'true';
            
            if (requiresPasswordChange) {
              // Redirect to change password screen
              router.push('/auth/change-password');
            } else if (userRole === 'admin') {
              // Admin users → redirect to admin dashboard
              router.push('/admin-dashboard');
            } else {
              // Provider admins and all others → redirect to dashboard (existing behavior)
              router.push('/dashboard');
            }
            return;
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
      // Fallback: redirect to dashboard if user data unavailable
      router.push('/dashboard');
      return;
    }

    // Check if password change is required
    const requiresPasswordChange = localStorage.getItem('requiresPasswordChange') === 'true';
    
    if (requiresPasswordChange) {
      // Redirect to change password screen
      router.push('/auth/change-password');
    } else if (user.role === 'admin') {
      // Admin users → redirect to admin dashboard
      router.push('/admin-dashboard');
    } else {
      // Provider admins and all others → redirect to dashboard (existing behavior)
      router.push('/dashboard');
    }
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
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Glad to see you again. Log in to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  disabled={isSigningIn}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  disabled={isSigningIn}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  disabled={isSigningIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Keep me logged in and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
                  className="w-4 h-4 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-[#009688] data-[state=checked]:border-[#009688]"
                />
                <Label
                  htmlFor="keepLoggedIn"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Keep me logged in
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-[#009688] dark:text-teal-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Forgot password clicked');
                }}
              >
                Forgot password
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isSigningIn || !email.trim() || !password.trim()}
              className="w-full h-12 bg-[#009688] hover:bg-[#008577] text-white font-semibold rounded-lg cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Indura. All right reserved.
          </p>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={(e) => {
              e.preventDefault();
              console.log('Get help clicked');
            }}
          >
            <HelpCircle className="h-4 w-4" />
            Get help
          </a>
        </div>
      </div>
    </div>
  );
};
