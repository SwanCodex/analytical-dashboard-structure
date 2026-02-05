import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from app.services.sector_index import compute_sector_indices


def get_market_returns(start_date, days_forward):
    ticker = yf.Ticker("^NSEI")
    end_date = start_date + timedelta(days=days_forward + 2)

    data = ticker.history(start=start_date, end=end_date)

    if len(data) < 2:
        return None

    start_price = data.iloc[0]["Close"]
    end_price = data.iloc[-1]["Close"]

    return round(((end_price - start_price) / start_price) * 100, 3)


def align_sector_with_market():
    sector_data = compute_sector_indices()
    event_date = datetime.strptime(sector_data["date"], "%Y-%m-%d")

    results = []

    for sector in sector_data["sector_indices"]:
        returns = {
            "t_plus_1": get_market_returns(event_date, 1),
            "t_plus_3": get_market_returns(event_date, 3),
            "t_plus_7": get_market_returns(event_date, 7)
        }

        results.append({
            "sector": sector["sector"],
            "sector_index": sector["index_value"],
            "article_count": sector["article_count"],
            "market_response": returns
        })

    return {
        "event_date": sector_data["date"],
        "aligned_results": results
    }
