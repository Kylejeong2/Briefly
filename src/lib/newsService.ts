import axios from 'axios';
import { load } from 'cheerio';

export async function scrapeNews(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    const title = $('h1').first().text();
    const summary = $('p').first().text();
    return `${title}\n\n${summary}`;
  } catch (error) {
    console.error(`Error scraping news from ${url}:`, error);
    return '';
  }
}

export async function generateSummary(text: string): Promise<string> {
  // TODO: Implement GPT-4 API call for summarization
  // For now, we'll return a placeholder summary
  return `Summary of: ${text.substring(0, 100)}...`;
}