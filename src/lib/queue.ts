import Queue from 'bull';
import { batchProcessNewsletters } from './batchProcessor';
import { newsletterJobDuration, newsletterJobSuccessCount, newsletterJobFailureCount } from '../app/api/metrics/route';

export const newsletterQueue = new Queue('newsletter-queue', process.env.REDIS_URL!);

newsletterQueue.process(async (job) => {
  const startTime = Date.now();

  try {
    await batchProcessNewsletters();

    // Update metrics
    const duration = (Date.now() - startTime) / 1000;
    newsletterJobDuration.set(duration);
    newsletterJobSuccessCount.inc();

    console.log(`Batch newsletter processing completed successfully`);
  } catch (error) {
    console.error(`Error processing newsletters:`, error);
    newsletterJobFailureCount.inc();
    throw error;
  }
});