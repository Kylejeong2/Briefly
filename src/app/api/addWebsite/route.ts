import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $websites } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    await db.insert($websites).values({ url }).onConflictDoNothing();

    return NextResponse.json({ message: 'Website added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding website:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}