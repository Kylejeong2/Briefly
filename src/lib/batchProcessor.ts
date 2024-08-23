import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { generateNewsletter } from './newsletterGenerator';
import { sendEmail } from './mailjetService';
import { FREE_TIER_OPTIONS } from '@/lib/constants';
import axios from 'axios';

interface UserData {
  id: string;
  email: string;
  websites: string[];
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
      if (FREE_TIER_OPTIONS.includes(website)) {
        if (!websiteMap.has(website)) {
          websiteMap.set(website, []);
        }
        websiteMap.get(website)!.push({
          id: user.id,
          email: user.email,
          websites: user.websites,
        });
      }
    });
  });

  // 3. Scrape and summarize each unique website using the Python server
  const summariesMap = new Map<string, ArticleSummary[]>();
  for (const [website, _] of Array.from(websiteMap.entries())) {
    try {
      const response = await axios.post('http://localhost:5000/scrape-and-summarize', { url: website });
      summariesMap.set(website, response.data);
    } catch (error) {
      console.error(`Error scraping and summarizing ${website}:`, error);
    }
  }

  // 4. Generate and send newsletters for each user
  for (const user of users) {
    const userSummaries = user.websites.flatMap(website => summariesMap.get(website) || []);
    const newsletterContent = generateNewsletter(userSummaries, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`);
    await sendEmail(user.email, 'Your Daily Briefly', newsletterContent);
  }
}