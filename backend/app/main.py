from fastapi import FastAPI
from app.services.market_data import get_market_overview
from app.services.market_data import get_market_overview
from app.services.market_alignment import align_sector_with_market
from app.services.prediction_engine import generate_market_outlook
from app.services.traceability import generate_traceability_report

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

@app.get("/api/overview")
def api_overview():
    return get_market_overview()


@app.get("/api/event-impact")
def api_event_impact():
    return align_sector_with_market()


@app.get("/api/prediction")
def api_prediction():
    return generate_market_outlook()


@app.get("/api/traceability")
def api_traceability():
    return generate_traceability_report()
