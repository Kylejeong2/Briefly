import { NextResponse } from 'next/server';
import { newsletterQueue } from '@/lib/queue';
import { batchProcessNewsletters } from '@/lib/batchProcessor';

export async function POST() {
  try {
    // Call the batch processor to group users and scrape websites
    const batchedData = await batchProcessNewsletters();

    // Add each batched job to the queue
    for (const job of batchedData) {
      await newsletterQueue.add(job);
    }

    return NextResponse.json({ message: `Newsletter batch jobs queued` }, { status: 200 });
  } catch (error) {
    console.error('Error queuing newsletter batch jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}