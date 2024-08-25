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

    console.log(`Attempting to unsubscribe user with email: ${email}`);

    // Find the user in the database
    const users = await db.select().from($users).where(eq($users.email, email.toLowerCase()));
    console.log(`Database query result:`, users);

    if (users.length > 0) {
      // Delete user from the database
      const deleteResult = await db.delete($users).where(eq($users.email, email.toLowerCase()));
      console.log(`Database delete result:`, deleteResult);
    } else {
      console.log(`User not found in database for email: ${email}`);
    }

    // Attempt to delete user from Clerk regardless of database presence
    try {
      const clerkUsers = await clerkClient.users.getUserList({ emailAddress: email });
    //   console.log(`Clerk users found:`, clerkUsers.data);

      if (clerkUsers.data.length > 0) {
        await clerkClient.users.deleteUser(clerkUsers.data[0].id);
        console.log(`User deleted from Clerk: ${clerkUsers.data[0].id}`);
      } else {
        console.log(`No user found in Clerk for email: ${email}`);
      }
    } catch (clerkError) {
      console.error('Error deleting user from Clerk:', clerkError);
    }

    console.log(`Successfully processed unsubscribe request for: ${email}`);
    return NextResponse.json({ message: 'Successfully processed unsubscribe request' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing unsubscribe request:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}