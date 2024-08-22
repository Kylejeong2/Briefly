// import { chromium } from 'playwright'
// import { z } from 'zod'
// import { openai } from '@ai-sdk/openai'
// import LLMScraper from 'llm-scraper'
// import { Readability } from '@mozilla/readability';

// export async function scrapeNews() {
//   // Launch a browser instance
//   const browser = await chromium.launch()

//   // Initialize LLM provider
//   const llm = openai.chat('gpt-4o-mini')

//   // Create a new LLMScraper
//   const scraper = new LLMScraper(llm)

//   // Open new page
//   const page = await browser.newPage()
//   await page.goto('https://news.ycombinator.com')

//   // Define schema to extract contents into
//   const schema = z.object({
//     top: z
//       .array(
//         z.object({
//           title: z.string(),
//           points: z.number(),
//           by: z.string(),
//           commentsURL: z.string(),
//           summary: z.string().optional(),
//         })
//       )
//       .length(5)
//       .describe('Top 5 stories on Hacker News'),
//   })

//   // Run the scraper
//   const { data } = await scraper.run(page, schema, {
//     format: 'html',
//   })
//   console.log(data.top)
//   // Show the result from LLM
//   console.log(JSON.stringify(data.top, null, 2))

//   await page.close()
//   await browser.close()
// }