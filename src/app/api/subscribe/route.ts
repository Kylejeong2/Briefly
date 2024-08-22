import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FREE_TIER_OPTIONS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, websites } = await req.json();

    if (!userId || !email || !websites || websites.length > 3) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const isPremium = websites.some((url: string) => !FREE_TIER_OPTIONS.includes(url));

    const existingUser = await db.select().from($users).where(eq($users.clerkId, userId)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already subscribed' }, { status: 400 });
    }

    await db.insert($users).values({ id: userId, clerkId: userId, email, websites, isPremium });

    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}