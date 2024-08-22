import { Gauge } from 'prom-client';

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

// Initialize the metrics
newsletterJobSuccessCount.set(0);
newsletterJobFailureCount.set(0);