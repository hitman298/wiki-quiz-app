from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import logging

from .database import engine, Base, get_db
from .models import Quiz
from .scraper import scrape_wikipedia
from .llm_service import generate_quiz

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wiki Quiz API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    url: str

@app.post("/api/quiz/generate")
def generate_quiz_endpoint(request: QuizRequest, db: Session = Depends(get_db)):
    """
    Endpoint to generate a quiz from a Wikipedia URL.
    
    1. Validates the URL.
    2. Checks the database cache for existing quizzes.
    3. Scrapes the Wikipedia page.
    4. Generates a quiz using the LLM.
    5. Stores the result and raw HTML in the database.
    """
    
    # 0. Validation (Bonus: Strict URL check)
    if "wikipedia.org/wiki/" not in request.url:
         raise HTTPException(status_code=400, detail="Invalid URL. Please provide a valid Wikipedia article URL.")

    # Check if URL already exists (Bonus: Caching)
    existing_quiz = db.query(Quiz).filter(Quiz.url == request.url).first()
    if existing_quiz:
        logging.info("Returning cached quiz")
        return {
            "id": existing_quiz.id,
            "url": existing_quiz.url,
            "title": existing_quiz.title,
            "summary": existing_quiz.summary,
            "key_entities": existing_quiz.key_entities,
            "sections": existing_quiz.sections,
            "quiz": existing_quiz.quiz_data,
            "related_topics": existing_quiz.related_topics
        }

    # 1. Scrape Content
    try:
        scraped_data = scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Scraping failed: {str(e)}")

    # 2. Generate with LLM using strictly grounded prompt
    try:
        llm_result = generate_quiz(scraped_data["text"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")

    # 3. Store in DB (including Raw HTML for Bonus)
    new_quiz = Quiz(
        url=request.url,
        title=scraped_data["title"],
        summary=llm_result.summary,
        key_entities=llm_result.key_entities,
        sections=scraped_data["sections"],
        quiz_data=[q.dict() for q in llm_result.quiz],
        related_topics=llm_result.related_topics,
        raw_html=scraped_data.get("html", "")
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return {
        "id": new_quiz.id,
        "url": new_quiz.url,
        "title": new_quiz.title,
        "summary": new_quiz.summary,
        "key_entities": new_quiz.key_entities,
        "sections": new_quiz.sections,
        "quiz": new_quiz.quiz_data,
        "related_topics": new_quiz.related_topics
    }

@app.get("/api/quiz")
def get_all_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).order_by(Quiz.created_at.desc()).all()
    return [{"id": q.id, "url": q.url, "title": q.title, "created_at": q.created_at} for q in quizzes]

@app.get("/api/quiz/{quiz_id}")
def get_quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "key_entities": quiz.key_entities,
        "sections": quiz.sections,
        "quiz": quiz.quiz_data,
        "related_topics": quiz.related_topics
    }
