# Q-Edge Guardian – Backend

> Quantum-Enhanced Edge Computing for Intelligent Traffic Management

## Quick Start

```bash
# 1. Create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
uvicorn app.main:app --reload
# or
python run.py
```

The server starts at **http://127.0.0.1:8000**.

## API Documentation

| UI       | URL                              |
| -------- | -------------------------------- |
| Swagger  | http://127.0.0.1:8000/docs      |
| ReDoc    | http://127.0.0.1:8000/redoc     |

## Endpoints

| Method | Path                 | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/`                  | Project info                |
| GET    | `/health`            | Health check                |
| POST   | `/api/v1/traffic`    | Create traffic record       |
| GET    | `/api/v1/traffic`    | List traffic records        |
| POST   | `/api/v1/emergency`  | Report emergency event      |
| GET    | `/api/v1/emergency`  | List emergency events       |
| POST   | `/api/v1/signal`     | Create traffic signal       |
| GET    | `/api/v1/signal`     | List traffic signals        |
| GET    | `/api/v1/dashboard`  | Dashboard summary           |

## Tech Stack

- Python 3.12+
- FastAPI
- SQLAlchemy (SQLite)
- Pydantic v2
- Uvicorn
