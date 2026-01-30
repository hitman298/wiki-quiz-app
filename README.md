# AI Wiki Quiz Generator

A full-stack application that transforms any Wikipedia article into an interactive quiz using AI. Built with FastAPI (Python) and React (Vite).

## Features

*   **Generative AI Quizzes**: Takes a Wikipedia URL, scrapes the content, and generates 5-10 multiple choice questions using Llama 3 (via Groq).
*   **Neo-Brutalist UI**: A unique, high-contrast, interactive interface with "pop" aesthetics.
*   **Quiz History**: Tracks all generated quizzes.
*   **Detailed Results**: Interactive score cards and confetti celebrations.
*   **Caching**: Prevents redundant processing by caching generated quizzes in PostgreSQL.
*   **Validation**: Ensures only valid Wikipedia URLs are processed.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, Axios.
*   **Backend**: Python, FastAPI, SQLAlchemy, Pydantic.
*   **Database**: PostgreSQL.
*   **AI/LLM**: LangChain, Groq API (Llama 3-70b).

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   PostgreSQL installed and running.

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    Create a `.env` file in `backend/` with:
    ```
    DATABASE_URL=postgresql://postgres:password@localhost:5432/wiki_quiz
    GROQ_API_KEY=your_groq_api_key_here
    ```
5.  Initialize the Database:
    ```bash
    python init_db.py
    ```
6.  Run the Server:
    ```bash
    uvicorn app.main:app --reload
    ```
    Server runs at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the Development Server:
    ```bash
    npm run dev
    ```
    App runs at `http://localhost:5173`.

## Testing

1.  Open the frontend URL.
2.  Paste a Wikipedia Link (e.g., `https://en.wikipedia.org/wiki/Quantum_computing`).
3.  Click "LET'S GO".
4.  Take the quiz and see your results.
5.  Check the "History" tab to see your saved quiz.

## Endpoints

*   `POST /api/quiz/generate`: Generate a new quiz from a URL.
*   `GET /api/quiz`: List all historical quizzes.
*   `GET /api/quiz/{id}`: Get details for a specific quiz.
