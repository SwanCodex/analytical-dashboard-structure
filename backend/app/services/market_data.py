import yfinance as yf
import numpy as np


def get_market_overview():
    # NIFTY 50 index (Yahoo Finance ticker)
    ticker = yf.Ticker("^NSEI")

    data = ticker.history(period="7d")

    if len(data) < 2:
        return None

    # Daily returns
    returns = data["Close"].pct_change().dropna()

    avg_return = float(np.mean(returns) * 100)
    volatility = float(np.std(returns) * 100)

    trend = "Up" if avg_return > 0 else "Down"

    return {
        "dominant_sector": "Market-Wide",
        "market_trend": trend,
        "average_return_percent": round(avg_return, 2),
        "volatility_percent": round(volatility, 2),
        "event_count": 0
    }
