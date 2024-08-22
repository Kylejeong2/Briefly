import { NextResponse } from 'next/server';
import { newsletterQueue } from '@/lib/queue';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

export async function POST() {
  try {
    // Fetch all users with email and urls
    const activeUsers = await db.select()
      .from($users)
      .where(
        and(
          isNotNull($users.email),
          sql`array_length(${$users.websites}, 1) > 0`
        )
      );

    // Add each user's newsletter request to the queue
    for (const user of activeUsers) {
      await newsletterQueue.add({
        userId: user.id,
        email: user.email,
        urls: user.websites
      });
    }

    return NextResponse.json({ message: `Newsletter batch job queued for ${activeUsers.length} users` }, { status: 200 });
  } catch (error) {
    console.error('Error queuing newsletter batch jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}