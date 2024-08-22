import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { newsletterQueue } from '@/lib/queue';

export async function POST() {
  try {
    const allUsers = await db.select().from($users);
    
    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({ message: 'No users found to send newsletters' }, { status: 404 });
    }

    const queueResults = await Promise.all(
      allUsers.map(async (user) => {
        try {
          await newsletterQueue.add(user);
          return { success: true, userId: user.id };
        } catch (queueError) {
          console.error(`Error queuing newsletter for user ${user.id}:`, queueError);
          return { success: false, userId: user.id, error: queueError };
        }
      })
    );

    const failedJobs = queueResults.filter(result => !result.success);

    if (failedJobs.length > 0) {
      console.error('Some newsletter jobs failed to queue:', failedJobs);
      return NextResponse.json({ 
        message: 'Some newsletter jobs failed to queue', 
        failedJobs 
      }, { status: 207 });
    }

    return NextResponse.json({ message: 'Newsletter jobs queued successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error queuing newsletter jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}