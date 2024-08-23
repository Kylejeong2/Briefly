import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Delete user from the database
    const result = await db.delete($users).where(eq($users.email, email));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Delete user from Clerk
    try {
      const usersResponse = await clerkClient.users.getUserList({ emailAddress: email });
      if (usersResponse.data.length > 0) {
        await clerkClient.users.deleteUser(usersResponse.data[0].id);
      }
    } catch (clerkError) {
      console.error('Error deleting user from Clerk:', clerkError);
      // Continue execution even if Clerk deletion fails
    }

    return NextResponse.json({ message: 'Successfully unsubscribed' }, { status: 200 });
  } catch (error) {
    console.error('Error processing unsubscribe request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}