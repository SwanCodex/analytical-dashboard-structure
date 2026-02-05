from app.services.news_ingestion import fetch_financial_news
from app.services.sector_classifier import classify_sector


def get_sector_classified_news():
    news = fetch_financial_news()
    enriched = []

    for item in news:
        classification = classify_sector(item.get("title", ""))

        enriched.append({
            **item,
            "sector": classification["sector"] if classification else None,
            "sector_confidence": classification["confidence"] if classification else None
        })

    return enriched
