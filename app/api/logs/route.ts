import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getLogs, addLog, clearLogs } from '@/app/lib/storage';

const ADMIN_PASSWORD = 'Mpn101305$!'; // In production, use environment variable

export async function GET(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('Authorization');
  
  if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const logs = getLogs();
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('Authorization');
  
  if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const log = await request.json();
  addLog(log);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('Authorization');
  
  if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  clearLogs();
  return NextResponse.json({ success: true });
} 