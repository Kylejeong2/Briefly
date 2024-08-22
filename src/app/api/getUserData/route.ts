import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  try {
    const user = await db.select().from($users).where(eq($users.clerkId, userId)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ email: user[0].email, websites: user[0].websites });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}