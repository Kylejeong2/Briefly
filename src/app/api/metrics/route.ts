import { NextResponse } from 'next/server';
import { register } from 'prom-client';
import { newsletterJobDuration, newsletterJobSuccessCount, newsletterJobFailureCount } from './metrics';

export async function GET() {
  return new NextResponse(await register.metrics(), {
    headers: {
      'Content-Type': register.contentType,
    },
  });
}

export async function POST(request: Request) {
  const { duration, success } = await request.json();

  newsletterJobDuration.set(duration);

  if (success) {
    newsletterJobSuccessCount.inc();
  } else {
    newsletterJobFailureCount.inc();
  }

  return new NextResponse(JSON.stringify({ message: 'Metrics updated successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}