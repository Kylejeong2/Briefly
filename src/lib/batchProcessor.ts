import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { scrapeNews } from './scraper';
import { generateSummary } from './summarizer';
import { generateNewsletter } from './newsletterGenerator';
import { sendEmail } from './mailjetService';
import { FREE_TIER_OPTIONS } from '@/lib/constants';

interface UserData {
  id: string;
  email: string;
  websites: string[];
  isPremium: boolean;
}

interface ArticleSummary {
  url: string;
  title: string;
  summary: string;
}

export async function batchProcessNewsletters() {
  // 1. Fetch all users
  const users = await db.select().from($users);

  // 2. Group users by website
  const websiteMap = new Map<string, UserData[]>();
  users.forEach(user => {
    user.websites.forEach(website => {
      if (FREE_TIER_OPTIONS.includes(website) || user.isPremium) {
        if (!websiteMap.has(website)) {
          websiteMap.set(website, []);
        }
        websiteMap.get(website)!.push(user);
      }
    });
  });

  // 3. Scrape and summarize each unique website
  const summariesMap = new Map<string, ArticleSummary[]>();
  for (const [website, _] of Array.from(websiteMap.entries())) {
    const articles = await scrapeNews(website);
    const summaries = await Promise.all(articles.map(async (article) => ({
      url: website,
      title: article.title,
      summary: await generateSummary(article.content) // need to wait unitl scraping is good
    })));
    summariesMap.set(website, summaries);
  }

  // 4. Generate and send newsletters for each user
  for (const user of users) {
    const userSummaries = user.websites.flatMap(website => summariesMap.get(website) || []);
    const newsletterContent = generateNewsletter(userSummaries);
    await sendEmail(user.email, 'Your Daily Briefly', newsletterContent);
  }
}