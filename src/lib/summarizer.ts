import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert at summarizing, and identifying key points in text.' },
      { role: 'user', content: `Summarize this text: """ ${text} """ , making sure to capture only the key points and using only 3 sentences.` }
    ],
    max_tokens: 1000,
    temperature: 0.3,
  });

  return response.choices[0].message.content || '';
}