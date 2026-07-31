# Q-Edge Guardian

Q-Edge Guardian is a system for real-time traffic detection, video analysis, and quantum-enhanced intelligent signal control. The architecture consists of a React/Vite frontend and a FastAPI backend powered by YOLOv8 for inference and Qiskit for quantum circuit operations.

## Prerequisites

- Node.js (v18 or higher recommended)
- Python (3.10 or higher)
- Access to a PostgreSQL database (e.g., Supabase)

## Backend Setup

The backend is built with FastAPI, SQLAlchemy, Ultralytics (YOLOv8), and Qiskit.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   Create a `.env` file in the `backend` directory and add your database configuration and other required variables (e.g., Supabase PostgreSQL connection string).

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   The backend API will be available at `http://127.0.0.1:8001`.

## Frontend Setup

The frontend is a React application built using Vite and styled with Tailwind CSS.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:5173`.
