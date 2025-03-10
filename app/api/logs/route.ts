import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Log from '@/app/models/Log';
import { headers } from 'next/headers';

function getClientIp(request: Request): string {
  const headersList = headers();
  
  // Try different headers in order of preference
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  for (const header of ipHeaders) {
    const value = headersList.get(header);
    if (value) {
      // If it's a comma-separated list, take the first IP
      const ips = value.split(',').map(ip => ip.trim());
      return ips[0];
    }
  }

  // If no IP headers found, try to get from request
  const forwarded = headersList.get('forwarded');
  if (forwarded) {
    const match = forwarded.match(/for=([^;]+)/);
    if (match) {
      return match[1];
    }
  }

  // If still no IP, return localhost for development
  return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'Unknown IP';
}

export async function GET() {
  try {
    await connectDB();
    const logs = await Log.find().sort({ timestamp: -1 });
    console.log('Fetched logs:', logs);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received log data:', body);
    
    // Ensure code is a string
    if (body.code === undefined) {
      body.code = '';
    }
    
    // Add IP address to the log
    body.ipAddress = getClientIp(request);
    console.log('Detected IP:', body.ipAddress); // Add logging
    
    await connectDB();
    const log = await Log.create(body);
    console.log('Created log:', log);
    return NextResponse.json(log);
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Log.deleteMany({});
    return NextResponse.json({ message: 'Logs cleared successfully' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
} 