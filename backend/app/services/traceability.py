from app.services.news_processor import get_sector_classified_news
from app.services.market_alignment import align_sector_with_market


def generate_traceability_report():
    news = get_sector_classified_news()
    alignment = align_sector_with_market()["aligned_results"]

    # Map sector → market response
    sector_market_map = {
        item["sector"]: item["market_response"]
        for item in alignment
    }

    traceability = []

    for item in news:
        sector = item.get("sector")

        traceability.append({
            "headline": item.get("title"),
            "source": item.get("source"),
            "published_at": item.get("published_at"),
            "sector": sector,
            "sector_confidence": item.get("sector_confidence"),
            "linked_market_response": sector_market_map.get(sector)
        })

    return traceability
