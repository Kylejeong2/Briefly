import Queue from 'bull';
import { newsletterJobDuration, newsletterJobSuccessCount, newsletterJobFailureCount } from '../app/api/metrics/metrics';
import { generateNewsletter } from './newsletterGenerator';
import { sendEmail } from './mailjetService';

export const newsletterQueue = new Queue('newsletter-queue', process.env.REDIS_URL!);

newsletterQueue.process(async (job) => {
  const startTime = Date.now();
    
  try {
    const { email, summaries } = job.data;

    // Generate newsletter content from summaries
    const newsletterContent = generateNewsletter(summaries, `${process.env.NEXT_PUBLIC_URL}/unsubscribe`);

    console.log('Newsletter content:', newsletterContent);
    // Send email to user
    await sendEmail(email, 'Your Daily Newsletter', newsletterContent);

    // Update metrics
    const duration = (Date.now() - startTime) / 1000;
    newsletterJobDuration.set(duration);
    newsletterJobSuccessCount.inc();

    console.log(`Newsletter processing completed successfully for ${email}`);
  } catch (error) {
    console.error(`Error processing newsletter:`, error);
    newsletterJobFailureCount.inc();
    throw error;
  }
});