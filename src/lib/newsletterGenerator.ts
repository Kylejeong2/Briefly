import Handlebars from 'handlebars';

const template = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .article { margin-bottom: 20px; }
    .article h2 { color: #333; }
    .article p { color: #666; }
    .footer { margin-top: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <h1>Your Daily Briefly</h1>
  {{#each articles}}
    <div class="article">
      <h2>{{title}}</h2>
      <p>{{summary}}</p>
    </div>
  {{/each}}
  <div class="footer">
    <p>To unsubscribe from this newsletter, <a href="{{unsubscribeUrl}}">click here</a>.</p>
  </div>
</body>
</html>
`;

const compiledTemplate = Handlebars.compile(template);

export function generateNewsletter(articles: { title: string; summary: string }[], unsubscribeUrl: string): string {
  return compiledTemplate({ articles, unsubscribeUrl });
}