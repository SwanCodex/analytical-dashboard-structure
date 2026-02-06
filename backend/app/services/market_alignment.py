from datetime import datetime, timedelta
from app.services.market_metrics import compute_market_returns
from app.services.sector_index import compute_sector_indices


def align_sector_with_market():
    """
    Aligns sector-level signals with market reactions over the last 10 days.
    Each (date × sector) pair is treated as an independent event.
    """

    sector_data = compute_sector_indices()
    sectors = sector_data["sector_indices"]

    today = datetime.today().date()

    # Generate last 10 calendar days (excluding today)
    event_dates = [
        (today - timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(1, 11)
    ]

    aligned_results = []

    for event_date in event_dates:
        market_response = compute_market_returns(event_date)

        # Normalize market_response to guarantee flat numeric values
        if market_response is not None:
            market_response = {
                "t_plus_1": (
                    next(iter(market_response["t_plus_1"].values()))
                    if isinstance(market_response.get("t_plus_1"), dict)
                    else market_response.get("t_plus_1")
                ),
                "t_plus_3": (
                    next(iter(market_response["t_plus_3"].values()))
                    if isinstance(market_response.get("t_plus_3"), dict)
                    else market_response.get("t_plus_3")
                ),
                "t_plus_7": (
                    next(iter(market_response["t_plus_7"].values()))
                    if isinstance(market_response.get("t_plus_7"), dict)
                    else market_response.get("t_plus_7")
                ),
                "data_complete": market_response.get("data_complete", False),
            }


        for sector in sectors:
            aligned_results.append({
                "event_date": event_date,
                "sector": sector["sector"],
                "sector_index": sector["index_value"],
                "article_count": sector["article_count"],
                "market_response": market_response
            })

    return {
        "window": "last_10_days",
        "aligned_results": aligned_results
    }
