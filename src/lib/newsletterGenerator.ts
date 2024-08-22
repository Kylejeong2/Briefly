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
  </style>
</head>
<body>
  <h1>Your Daily News Summary</h1>
  {{#each articles}}
    <div class="article">
      <h2>{{title}}</h2>
      <p>{{summary}}</p>
    </div>
  {{/each}}
</body>
</html>
`;

const compiledTemplate = Handlebars.compile(template);

export function generateNewsletter(articles: { title: string; summary: string }[]): string {
  return compiledTemplate({ articles });
}