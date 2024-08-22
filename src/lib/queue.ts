import Queue from 'bull';
import { batchProcessNewsletters } from './batchProcessor';
import { newsletterJobDuration, newsletterJobSuccessCount, newsletterJobFailureCount } from '../app/api/metrics/metrics';
import { generateNewsletter } from './newsletterGenerator';
import { sendEmail } from './mailjetService';

export const newsletterQueue = new Queue('newsletter-queue', process.env.REDIS_URL!);

newsletterQueue.process(async (job) => {
  const startTime = Date.now();
    
  try {
    // Send request to Python server with user's URLs
    const summaries = [];
    for (const url of job.data.urls) {
      const summary = await fetch(`${process.env.PYTHON_SERVER_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      }).then(res => res.json());
      summaries.push(summary);
    }

    // Generate newsletter content from summaries
    const newsletterContent = generateNewsletter(summaries);

    // Send email to user
    await sendEmail(job.data.email, 'Your Daily Newsletter', newsletterContent);

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