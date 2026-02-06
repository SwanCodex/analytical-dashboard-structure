# 📊 Event Impact Intelligence Dashboard
---
## 1️⃣ How to Run the Project (After Cloning)

### 🔧 Prerequisites

* Node.js (v18+ recommended)
* Python (v3.10+ recommended)
* Git
* Internet connection (for live market data via `yfinance`)

---

### ▶️ Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app
```

Backend will start at:

```
http://localhost:8000
```

Health check:

```
http://localhost:8000/health
```

---

### ▶️ Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 2️⃣ What Has Been Done So Far

### ✅ Backend

* Built a **FastAPI-based analytical backend**
* Implemented an **event–market alignment engine**
* Integrated **live market data fetching** using `yfinance`
* Computed **post-event market returns** for:

  * T+1 day
  * T+3 days
  * T+7 days
* Designed backend to return **rolling event windows** (last 10 days)
* Ensured backend supports **incomplete market data gracefully**
* Exposed REST API endpoint:

  ```
  /api/event-impact
  ```

---

### ✅ Frontend

* Built a **professional analytics dashboard UI**
* Implemented:

  * Bar charts for post-event returns
  * Expandable data table for detailed inspection
* Added **defensive frontend adapters** to handle evolving backend schemas
* Ensured UI:

  * Does not crash on missing or partial data
  * Displays placeholders (`—`) for unavailable values
* Implemented **clean visual cues**:

  * Green / red returns
  * Greyed-out incomplete data
* Successfully integrated backend API with frontend rendering

---

## 3️⃣ Technical Approach (So Far)

### 🧠 Core Idea

The project analyzes **how different macro-economic event categories align with short-term market movements**, using real financial index data.

---

### 🏗 Backend Architecture

* **Service-oriented design**

  * `market_metrics.py` → market return computation
  * `market_alignment.py` → event × date × sector alignment
  * `sector_index.py` → sector signal computation
* **Rolling-window analysis**

  * Uses last 10 calendar days (excluding today)
  * Automatically adapts as new market data becomes available
* **Graceful degradation**

  * If post-event trading days are insufficient, values return as `null`
  * Prevents misleading analytics

---

### 🎨 Frontend Architecture

* **Single source of truth for formatting**

  * All numeric formatting handled centrally
* **Schema-tolerant adapter layer**

  * Frontend safely consumes structured backend responses (e.g. `{ "^NSEI": value }`)
* **UI-first analytics**

  * Charts for pattern recognition
  * Tables for precise inspection
* **User trust emphasis**

  * Explicit notices when data is still unfolding
  * No fabricated or extrapolated values

---

## 4️⃣ What Is Left to Do

### 🔜 Backend

* Compute and expose:

  * 30-day post-event returns
  * Volatility metrics (standard deviation)
* Add caching to reduce repeated market data fetches
* Improve sector index calculation using weighted article importance

---

### 🔜 Frontend

* Group event impact data **by date** for better readability
* Add filters:

  * By event category
  * By date range
* Improve chart labeling for dense datasets
* Add tooltips explaining market metrics for non-finance users

---

## 5️⃣ How the Remaining Work Must Be Done

### 🧪 Backend Extensions

* Extend `compute_market_returns()` to:

  * Fetch longer historical windows
  * Calculate volatility using rolling standard deviation
* Maintain **non-blocking API behavior** for incomplete data
* Introduce optional persistence (SQLite / CSV cache) for performance

---

### 🎨 Frontend Enhancements

* Introduce **date-based grouping headers** in the table
* Keep frontend logic **purely presentational**

  * All computation must remain in backend
* Preserve current defensive rendering strategy
* Avoid hard assumptions about backend completeness

---

### 🎯 Guiding Principle

> **Accuracy over completeness.
> Transparency over speculation.
> Robustness over shortcuts.**

This project prioritizes **real-world financial reliability** over artificially polished outputs.