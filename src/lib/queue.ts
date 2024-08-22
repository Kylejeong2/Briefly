import Queue from 'bull';
import { scrapeNews } from './scraper';
import { generateSummary } from './summarizer';
import { sendEmail } from './mailjetService';
import { newsletterJobDuration, newsletterJobSuccessCount, newsletterJobFailureCount } from '../app/api/metrics/route';

export const newsletterQueue = new Queue('newsletter-queue', process.env.REDIS_URL!);

newsletterQueue.process(async (job) => {
  const startTime = Date.now();
  const user = job.data;

  try {
    // Scrape news from user's websites
    const scrapedArticles = await Promise.all(user.websites.map(scrapeNews));
    const allArticles = scrapedArticles.flat();

    // Generate summaries for each article
    const summaries = await Promise.all(allArticles.map(generateSummary));

    // Generate newsletter content
    const newsletterContent = summaries.join('\n\n');

    // Send email
    await sendEmail(user.email, 'Your Daily Briefly', newsletterContent);

    // Update metrics
    const duration = (Date.now() - startTime) / 1000;
    newsletterJobDuration.set(duration);
    newsletterJobSuccessCount.inc();

    console.log(`Newsletter sent successfully to ${user.email}`);
  } catch (error) {
    console.error(`Error processing newsletter for ${user.email}:`, error);
    newsletterJobFailureCount.inc();
    throw error;
  }
});