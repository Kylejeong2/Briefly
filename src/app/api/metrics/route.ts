import { NextResponse } from 'next/server';
import { register, Gauge } from 'prom-client';

export const newsletterJobDuration = new Gauge({
  name: 'newsletter_job_duration_seconds',
  help: 'Duration of newsletter job in seconds',
});

export const newsletterJobSuccessCount = new Gauge({
  name: 'newsletter_job_success_count',
  help: 'Number of successful newsletter sends',
});

export const newsletterJobFailureCount = new Gauge({
  name: 'newsletter_job_failure_count',
  help: 'Number of failed newsletter sends',
});

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

// // Initialize the metrics
// register.registerMetric(newsletterJobDuration);
// register.registerMetric(newsletterJobSuccessCount);
// register.registerMetric(newsletterJobFailureCount);

// // Set default values
// newsletterJobSuccessCount.set(0);
// newsletterJobFailureCount.set(0);