from fastapi import FastAPI
from app.services.market_data import get_market_overview

app = FastAPI(title="Market Impact Intelligence Engine")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/overview")
def overview():
    data = get_market_overview()
    if data is None:
        return {"error": "Insufficient market data"}
    return data
