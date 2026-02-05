from fastapi import FastAPI

app = FastAPI(title="Market Impact Intelligence Engine")

@app.get("/health")
def health_check():
    return {"status": "ok"}
