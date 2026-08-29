# AgriGuard-AI 🌾🛡️

AI-powered City Food-Resilience Intelligence Platform for Fund My Crazy — "Surprise Us!"

## Overview

AgriGuard-AI is designed to model the cascade from agricultural land risks to urban market supply disruptions, focusing on prototype city **Pune, Maharashtra, India**.

**Core Chain:**  
`Agricultural land → disaster → food markets → city food-supply risk → recovery priorities`

---

## Architecture Foundation

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, MapLibre GL JS
- **Backend:** Python, FastAPI, Pydantic v2, Uvicorn
- **Database:** PostgreSQL + PostGIS extension (runs via Docker Compose locally or Render PostgreSQL in production)
- **AI Integration:** Google Gemini API via server-side Backend service

---

## Folder Structure

```
agri-guard-ai/
├── render.yaml             # Render Blueprint deployment configuration
├── backend/                # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API endpoints (health, food_system, flood, risk, ai)
│   │   ├── core/           # Config, settings, database session, geospatial utils
│   │   ├── models/         # SQLAlchemy ORM database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic engines (damage, risk, priority, gemini)
│   │   └── main.py         # FastAPI app initialization
│   ├── seed.py             # Database table & seed initialization script
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   └── pytest.ini          # Pytest configuration
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Landing page (/) & Command Center (/command-center)
│   │   ├── components/     # React UI components (MapView, RiskGauge, Analyst, etc.)
│   │   └── lib/            # Typed API client
│   ├── package.json        # Node dependencies & scripts
│   ├── tsconfig.json font   # TypeScript configuration
│   └── tailwind.config.ts  # Tailwind CSS configuration
├── docker-compose.yml      # PostGIS local database container setup
├── .env.example            # Environment template
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js v18+ & npm
- Python 3.10+
- Docker & Docker Compose (for PostgreSQL + PostGIS)

### 1. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Start PostGIS Database

```bash
docker-compose up -d
```

### 3. Backend Setup & Run

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Unix:
# source venv/bin/activate

pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

Backend API: [http://localhost:8000](http://localhost:8000)  
Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Landing Page: [http://localhost:3000](http://localhost:3000)  
Command Center: [http://localhost:3000/command-center](http://localhost:3000/command-center)

---

## Render Deployment Guide

AgriGuard-AI is configured for multi-service deployment on Render using the included `render.yaml` Blueprint.

### Services Architecture on Render

1. **Database:** PostgreSQL instance with PostGIS (`agriguard-db`)
2. **Backend Web Service:** FastAPI Service (`agriguard-ai-python-api`)
3. **Frontend Web Service:** Next.js Service (`agriguard-ai-frontend`)

### Render Environment Variables

#### Backend Environment Variables:
- `PORT`: Handled automatically by Render (binds to `0.0.0.0`)
- `ENVIRONMENT`: `production`
- `DATABASE_URL`: Automatically populated from `agriguard-db` connection string
- `CORS_ORIGINS`: Comma-separated allowed origins e.g. `https://agriguard-ai-frontend.onrender.com,http://localhost:3000`
- `GEMINI_API_KEY`: Server-side Gemini API key (set in Render Dashboard under secret environment variables)

#### Frontend Environment Variables:
- `NEXT_PUBLIC_API_URL`: Backend service URL e.g. `https://agriguard-ai-python-api.onrender.com`

---

### Production Database Initialization & Seed Procedure

On a fresh Render PostgreSQL instance:

1. **Enable PostGIS & Create Tables:**
   Connect to the backend service Shell or run command via Render jobs:
   ```bash
   cd backend
   python seed.py
   ```
2. `seed.py` will execute `CREATE EXTENSION IF NOT EXISTS postgis;`, create all required tables (`agricultural_parcels`, `markets`, `market_links`, `cultivation_evidence`, `flood_events`, `parcel_flood_impacts`, `food_risk_assessments`, `market_risk_assessments`, `recovery_priorities`), and seed the prototype Pune food system dataset.

---

## Testing & Verification

### Run Backend Tests

```bash
cd backend
pytest
```

### Run Frontend Build & Type Check

```bash
cd frontend
npm run build
```
