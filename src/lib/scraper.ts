import puppeteer from 'puppeteer';

export async function scrapeNews(url: string): Promise<string[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const articles = await page.evaluate(() => {
    const articleElements = document.querySelectorAll('article');
    return Array.from(articleElements).slice(0, 5).map(article => {
      const title = article.querySelector('h2')?.textContent || '';
      const summary = article.querySelector('p')?.textContent || '';
      return `${title}\n${summary}`;
    });
  });

  await browser.close();
  return articles;
}