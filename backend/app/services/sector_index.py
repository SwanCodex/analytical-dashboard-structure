from collections import defaultdict
from datetime import datetime
from app.services.news_processor import get_sector_classified_news


def compute_sector_indices():
    news = get_sector_classified_news()

    sector_stats = defaultdict(lambda: {"count": 0, "confidence_sum": 0.0})

    for item in news:
        sector = item.get("sector")
        confidence = item.get("sector_confidence")

        if sector and confidence:
            sector_stats[sector]["count"] += 1
            sector_stats[sector]["confidence_sum"] += confidence

    sector_indices = []

    for sector, stats in sector_stats.items():
        index_value = round(
            stats["count"] * (stats["confidence_sum"] / stats["count"]), 3
        )

        sector_indices.append({
            "sector": sector,
            "index_value": index_value,
            "article_count": stats["count"]
        })

    return {
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "sector_indices": sector_indices
    }
