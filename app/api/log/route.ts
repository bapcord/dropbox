import { NextResponse } from 'next/server';
import { redis } from '@/app/lib/redis';

const LOGS_KEY = 'dropbox:logs';
const MAX_LOGS = 1000;

export async function POST(request: Request) {
  try {
    const log = await request.json();
    
    // Add device info to the log
    const enhancedLog = {
      ...log,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: request.headers.get('user-agent') || 'Unknown',
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'Local'
      }
    };

    console.log('Attempting to save log:', enhancedLog);

    // Add new log to the beginning of the list
    await redis.lpush(LOGS_KEY, JSON.stringify(enhancedLog));
    
    // Keep only the latest MAX_LOGS entries
    await redis.ltrim(LOGS_KEY, 0, MAX_LOGS - 1);
    
    console.log('Log saved successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing log:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to save log',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('Attempting to fetch logs');
    
    // Test Redis connection first
    try {
      await redis.ping();
    } catch (pingError) {
      throw new Error('Redis connection failed - please check your credentials');
    }
    
    // Get all logs
    const logs = await redis.lrange(LOGS_KEY, 0, -1);
    console.log(`Retrieved ${logs.length} logs`);
    
    // Parse JSON strings back to objects
    const parsedLogs = logs.map(log => {
      try {
        return JSON.parse(log);
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    return NextResponse.json(parsedLogs);
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to read logs',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 