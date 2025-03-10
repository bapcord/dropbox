import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  
  // Try to get IP from various headers
  const ip = headersList.get('x-forwarded-for') || 
             headersList.get('x-real-ip') ||
             '127.0.0.1';

  return NextResponse.json({ ip });
} 