import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { $users } from '@/lib/db/schema';
import { scrapeNews, generateSummary } from '@/lib/newsService';
import { sendEmail } from '@/lib/mailjetService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const allUsers = await db.select().from($users);

      for (const user of allUsers) {
        const newsItems = await Promise.all(user.websites.map(scrapeNews));
        const summaries = await Promise.all(newsItems.map(generateSummary));

        const emailContent = summaries.join('\n\n');
        await sendEmail(user.email, 'Your Daily Newsletter', emailContent);
      }

      res.status(200).json({ message: 'Newsletters sent successfully' });
    } catch (error) {
      console.error('Error sending newsletters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}