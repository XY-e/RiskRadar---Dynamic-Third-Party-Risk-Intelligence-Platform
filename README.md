# Vendor Risk Intelligence Platform

Full-stack vendor/third-party risk scoring app. Backend: FastAPI + SQLite/SQLAlchemy.
Frontend: React + Tailwind + Recharts. Currently runs entirely on **mock data** so you
can demo it offline — swap in real API keys to go live (see "Going live" below).

## What's included (Must-Have + Should-Have)

- Risk scoring engine (weighted: compliance 30%, cyber 20%, news 15%, financial 15%,
  esg 10%, domain 5%, social 5%) — admin-tunable weights
- Mock-data services standing in for OpenSanctions, NewsAPI, Shodan, Whois, Yahoo
  Finance, MSCI ESG — same function signatures as the real integrations
- News sentiment classification (heuristic now; swap-in for
  `cardiffnlp/twitter-roberta-base-sentiment` documented in code)
- LLM explainability (template-based by default; uses Claude API automatically if
  `ANTHROPIC_API_KEY` is set)
- Full dashboard: portfolio gauge, risk distribution, vendor table
- Company Search with full profile view
- Risk Breakdown: radar chart, pie chart, bar chart per company
- News Feed with sentiment filter
- Cyber Exposure: open ports, SSL, CVEs
- Compliance: sanctions, PEP, country risk, domain reputation
- AI Insights page (LLM summary + recommendation + PDF link)
- Historical Trends (15-day mock risk history, toggleable series)
- Alert Center (auto-generated for High/Critical risk vendors, mark-as-read)
- One-click PDF Report Generator (reportlab)
- Admin page to tune scoring weights live
- Daily scheduled jobs (APScheduler): fetch_news, fetch_shodan, update sanctions
  scores, calculate_scores, send_alerts

## Quick start

### One-time setup
```bash
cd backend  && pip install -r requirements.txt
cd ../frontend && npm install
```

### Run everything with one command
```bash
python run.py        # or: ./run.sh
```
This starts the backend (http://localhost:8000) and frontend (http://localhost:5173)
together in the same terminal, with `[backend]`/`[frontend]` prefixed logs, and stops
both cleanly on Ctrl+C. First run auto-creates `frontend/.env` pointing at the local
backend. Visit **http://localhost:5173**.

### Run them separately (optional, e.g. for separate log windows)

**Backend**
```bash
cd backend
uvicorn main:app --reload --port 8000
```
On first run this auto-creates `vendor_risk.db` (SQLite) and seeds 12 mock companies
with full risk data. Visit http://localhost:8000/docs for interactive API docs.

**Frontend**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```
Visit http://localhost:5173.

## Going live (replacing mock data)

Each external integration lives in one place so you can swap it without touching
the rest of the app:

| Spec source              | File                                  |
|---------------------------|----------------------------------------|
| OpenCorporates / Clearbit / SSM | `backend/services/mock_data.py::generate_company_info` |
| OpenSanctions              | `backend/services/mock_data.py::generate_sanctions` |
| NewsAPI / GNews            | `backend/services/mock_data.py::generate_news` |
| Shodan / Censys            | `backend/services/mock_data.py::generate_cyber` |
| Whois                      | `backend/services/mock_data.py::generate_domain` |
| Yahoo Finance / Alpha Vantage / SEC | `backend/services/mock_data.py::generate_financials` |
| MSCI ESG / Sustainalytics  | `backend/services/mock_data.py::generate_esg` |
| cardiffnlp sentiment model | `backend/ml/sentiment.py` (swap instructions in the docstring) |
| Claude / LLM explainability | `backend/services/llm_explain.py` (auto-activates with `ANTHROPIC_API_KEY` env var) |

Set `DATABASE_URL` env var to point at Postgres/Supabase instead of SQLite —
`backend/database/__init__.py` already supports both.

## Project layout
```
backend/
  api/schemas.py        Pydantic request/response models
  database/              SQLAlchemy engine/session
  models/                ORM tables (Company, News, Sanctions, CyberFinding, ...)
  ml/sentiment.py         Sentiment classifier
  risk_engine/scoring.py  Weighted risk scoring formulas
  routes/                 FastAPI routers (companies, data, insights/admin)
  scheduler/jobs.py       APScheduler daily jobs
  services/               mock_data, llm_explain, pdf_report
  utils/seed.py           DB seed script
  main.py                 App entrypoint

frontend/
  src/api/client.js       Fetch wrapper for all backend endpoints
  src/components/         Layout, shared UI (cards, gauges, badges), CompanyPicker
  src/pages/               Dashboard, CompanySearch, RiskBreakdown, NewsFeed,
                            CyberExposure, Compliance, AIInsights, HistoricalTrends,
                            AlertCenter, Admin
```

## Not yet implemented (Nice-to-Have, from your spec)
RAG chatbot (ChromaDB + LangChain), Similar Company Retrieval (embeddings/FAISS),
Scenario Simulation, Geographic Risk Map, JWT auth/roles, email alerts, OCR upload,
speech assistant, Docker/CI. The codebase is structured (`rag/`, `scraper/` folders
already scaffolded) to drop these in next.
