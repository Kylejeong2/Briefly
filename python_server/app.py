import os
from dotenv import load_dotenv
from scrapegraphai.graphs import SmartScraperGraph
import openai
import sys

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

graph_config = {
    "llm": {
        "api_key": os.getenv("OPENAI_API_KEY"),
        "model": "gpt-4o-mini",  
    },
    "verbose": True,
    "headless": True,
}

def scrape_website(url):
    smart_scraper_graph = SmartScraperGraph(
        prompt="You are an expert at summarizing and identifying key points in text. Locate the top 3 articles of the day on the website and summarize each of them. Make sure to capture only the key points and using only 3 sentences. The format of your summary response should look like this every time: {'top_articles': [{'title': '', 'summary': ''}, {'title': '', 'summary': ''}, {'title': '', 'summary': ''}]}",
        source=url,
        config=graph_config,
    )
    result = smart_scraper_graph.run()
    print(result)
    return result

def scrape_and_summarize(url):
    summary = scrape_website(url)
    response = {
        'url': url,
        'summary': summary
    }
    return response

def main():
    if len(sys.argv) != 2:
        print("Usage: python app.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    result = scrape_and_summarize(url)
    print(f"URL: {result['url']}")
    print(f"Summary: {result['summary']}")

if __name__ == "__main__":
    main()