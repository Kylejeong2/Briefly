import { NextResponse } from 'next/server';
import { newsletterQueue } from '@/lib/queue';

export async function POST() {
  try {
    await newsletterQueue.add({});
    return NextResponse.json({ message: 'Newsletter batch job queued successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error queuing newsletter batch job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}