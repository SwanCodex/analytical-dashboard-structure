import os
import requests
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

NEWS_ENDPOINT = "https://newsapi.org/v2/top-headlines"


def fetch_financial_news():
    if not NEWS_API_KEY:
        raise RuntimeError("NEWS_API_KEY not set")

    params = {
        "category": "business",
        "language": "en",
        "pageSize": 20,
        "apiKey": NEWS_API_KEY
    }

    response = requests.get(NEWS_ENDPOINT, params=params)
    response.raise_for_status()

    articles = response.json().get("articles", [])

    structured_news = []

    for article in articles:
        structured_news.append({
            "title": article.get("title"),
            "source": article.get("source", {}).get("name"),
            "published_at": article.get("publishedAt"),
            "content": article.get("content")
        })

    return structured_news
