// Types
type Article = {
  url: string;
  title: string;
  summary: string;
  source: string;
};

type GroupedArticles = Record<string, Article[]>;

// Helper functions
function generateHead(): string {
  return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Daily Briefly</title>
  <style>
    body { font-family: Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
    .container { background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
    h1 { font-size: 28px; color: #000; text-align: center; margin-bottom: 30px; }
    .source { margin-bottom: 30px; }
    .source h2 { font-size: 22px; color: #000; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
    .article { margin-bottom: 25px; }
    .article h3 { font-size: 18px; color: #1a73e8; margin-bottom: 5px; }
    .article a { color: #1a73e8; text-decoration: none; font-weight: bold; }
    .article a:hover { text-decoration: underline; }
    .article p { font-size: 16px; color: #555; margin-top: 5px; }
    .footer { margin-top: 30px; font-size: 14px; color: #777; text-align: center; }
    .emoji { font-size: 20px; margin-right: 5px; }
  </style>
</head>`;
}

function generateArticleHTML(article: Article): string {
  return `
    <div class="article">
      <h3><a href="${article.url}">${article.title}</a></h3>
      <p>${article.summary}</p>
    </div>`;
}

function generateSourceHTML(source: string, articles: Article[]): string {
  const emoji = getSourceEmoji(source);
  return `
  <div class="source">
    <h2><span class="emoji">${emoji}</span>${source}</h2>
    ${articles.map(generateArticleHTML).join('')}
  </div>`;
}

function generateFooter(unsubscribeUrl: string): string {
  return `
  <div class="footer">
    <p>That's all for today! See you tomorrow bright and early. ☀️</p>
    <p>To unsubscribe from this newsletter, <a href="${unsubscribeUrl}">click here</a>.</p>
  </div>`;
}

function getSourceEmoji(source: string): string {
  // Add more emojis for different sources
  const emojiMap: Record<string, string> = {
    "Tech News": "💻",
    "Business": "💼",
    "Science": "🔬",
    "Sports": "⚽",
    "Entertainment": "🎬",
  };
  return emojiMap[source] || "📰";
}

// Main function
export function generateNewsletter(articles: Article[], unsubscribeUrl: string): string {
  const groupedArticles = articles.reduce((acc, article) => {
    if (!acc[article.source]) {
      acc[article.source] = [];
    }
    acc[article.source].push(article);
    return acc;
  }, {} as GroupedArticles);

  const sourcesHTML = Object.entries(groupedArticles)
    .map(([source, articles]) => generateSourceHTML(source, articles))
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
${generateHead()}
<body>
  <div class="container">
    <h1>☕ Your Daily Briefly</h1>
    ${sourcesHTML}
    ${generateFooter(unsubscribeUrl)}
  </div>
</body>
</html>`;
}