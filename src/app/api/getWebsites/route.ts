import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $websites } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  try {
    const websites = await db.select().from($websites);

    return NextResponse.json({ websites }, { status: 200 });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
