import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $users, $websites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, websites } = await req.json();

    if (!userId || !email || !websites || websites.length > 3) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existingUser = await db.select().from($users).where(eq($users.clerkId, userId)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already subscribed' }, { status: 400 });
    }

    // Insert user
    await db.insert($users).values({ id: userId, clerkId: userId, email, websites });

    // Ensure all websites are in the websites table
    for (const website of websites) {
      await db.insert($websites).values({ url: website }).onConflictDoNothing();
    }

    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}