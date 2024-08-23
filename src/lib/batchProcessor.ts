import { db } from '@/lib/db';
import { $users, $websites } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';

interface ArticleSummary {
  url: string;
  title: string;
  summary: string;
}

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || 'http://localhost:5000';
const API_KEY = process.env.FLASK_API_KEY;

if (!API_KEY) {
  throw new Error('FLASK_API_KEY is not set in the environment variables');
}

export async function batchProcessNewsletters() {
  try {
    // 1. Fetch all users
    const users = await db.select().from($users);

    // 2. Get unique websites
    const uniqueWebsites = new Set(users.flatMap(user => user.websites));
    // 3. Ensure all websites are in the websites table
    await db.insert($websites).values(
      Array.from(uniqueWebsites).map(website => ({ url: website }))
    ).onConflictDoNothing();

    // 4. Fetch all websites
    const websites = await db.select().from($websites).where(inArray($websites.url, Array.from(uniqueWebsites)));

    // 5. Call Python script for scraping and summarization
    const websiteUrls = websites.map(website => website.url);
    const summaries = await fetchSummariesFromFlask(websiteUrls);

    // 6. Prepare batched jobs for the queue
    const batchedJobs = [];
    for (const user of users) {
      const userSummaries = summaries.filter(summary => user.websites.includes(summary.url));

      batchedJobs.push({
        userId: user.id,
        email: user.email,
        summaries: userSummaries,
      });
    }

    return batchedJobs;
  } catch (error) {
    console.error('Error in batchProcessNewsletters:', error);
    // Handle the error appropriately (e.g., return an empty array or rethrow)
    return [];
  }
}

async function fetchSummariesFromFlask(urls: string[]): Promise<ArticleSummary[]> {
  const response = await fetch(`${FLASK_SERVER_URL}/scrape-and-summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY || '',
    },
    body: JSON.stringify({ urls }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}