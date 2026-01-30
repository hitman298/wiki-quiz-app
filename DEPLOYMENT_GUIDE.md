# Deployment Guide

Follow these steps to deploy your application for free.

## Step 1: Push to GitHub

1.  Create a new repository on GitHub (e.g., `wiki-quiz-app`).
2.  Open your terminal in the project root (`x:\sem project`) and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/wiki-quiz-app.git
    git push -u origin main
    ```

## Step 2: Deploy Backend (Render)

1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Name**: `wiki-quiz-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5.  **Environment Variables** (Add these):
    *   `PYTHON_VERSION`: `3.9.0` (or higher)
    *   `GROQ_API_KEY`: Paste your actual key.
    *   `DATABASE_URL`: Render provides a *Internal Database URL* if you create a Postgres database on Render.
        *   **Tip**: Create a **New +** -> **PostgreSQL** on Render first. Copy its "Internal Database URL" and paste it here as `DATABASE_URL`.
6.  Click **Create Web Service**.
7.  Wait for deployment. Copy your backend URL (e.g., `https://wiki-quiz-backend.onrender.com`).

## Step 3: Deploy Frontend (Vercel)

1.  Go to [vercel.com](https://vercel.com).
2.  Click **Add New ...** -> **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: Edit this -> Select `frontend`.
5.  **Environment Variables**:
    *   Add `VITE_API_URL` with value: `https://wiki-quiz-backend.onrender.com` (Your Render Backend URL from Step 2).
    *   **Important**: Do NOT add a trailing slash `/` at the end.
6.  Click **Deploy**.

## Step 4: Final Verification

1.  Open your Vercel URL.
2.  Try generating a quiz.
    *   If it fails, check the Browser Console (F12) to see if the API URL is correct.
    *   Check Render logs to see if the backend is receiving requests.
