import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
from app.services.market_alignment import align_sector_with_market


def generate_market_outlook():
    aligned = align_sector_with_market()["aligned_results"]

    all_returns = []

    # Try event-based returns first
    for sector in aligned:
        returns = sector["market_response"]
        for key in ["t_plus_1", "t_plus_3", "t_plus_7"]:
            if returns[key] is not None:
                all_returns.append(returns[key])

    # Fallback: recent market behavior
    if not all_returns:
        ticker = yf.Ticker("^NSEI")
        data = ticker.history(period="7d")

        if len(data) < 2:
            return {"error": "Insufficient data for prediction"}

        returns = data["Close"].pct_change().dropna() * 100
        all_returns = returns.tolist()

    avg_return = float(np.mean(all_returns))
    volatility = float(np.std(all_returns))

    # Probabilistic logic
    prob_down = min(max(abs(avg_return) / 2, 0.3), 0.7)
    prob_up = round(1 - prob_down, 2)

    volatility_risk = "High" if volatility > 0.8 else "Moderate"

    return {
        "direction_probability": {
            "up": prob_up,
            "down": round(prob_down, 2)
        },
        "volatility_risk": volatility_risk
    }
