import yfinance as yf
import pandas as pd
from datetime import timedelta


def compute_market_returns(event_date: str, ticker="^NSEI"):
    print(">>> compute_market_returns CALLED with date:", event_date)
    """
    Computes T+1, T+3, T+7 returns for a given event date
    """
    event_dt = pd.to_datetime(event_date)

    start = event_dt - timedelta(days=5)
    end = event_dt + timedelta(days=10)

    data = yf.download(ticker, start=start, end=end, progress=False)

    if data.empty:
        return {"t_plus_1": None, "t_plus_3": None, "t_plus_7": None}

    data = data.reset_index()

    # First trading day on or after event
    # Use nearest available trading day on or BEFORE event date
    valid_days = data[data["Date"] <= event_dt]

    if valid_days.empty:
        return {"t_plus_1": None, "t_plus_3": None, "t_plus_7": None}

    base_row = valid_days.iloc[-1]
    base_price = base_row["Close"]
    base_index = base_row.name


    def safe_return(offset):
        try:
            future_price = data.iloc[base_index + offset]["Close"]
            return round(((future_price - base_price) / base_price) * 100, 3)
        except Exception:
            return None

    t1 = safe_return(1)
    t3 = safe_return(3)
    t7 = safe_return(7)

    def extract_value(x):
        if isinstance(x, dict):
            return next(iter(x.values()))
        return x

    return {
        "t_plus_1": extract_value(t1),
        "t_plus_3": extract_value(t3),
        "t_plus_7": extract_value(t7),
        "data_complete": any(v is not None for v in [t1, t3, t7])
    }
