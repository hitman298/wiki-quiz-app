from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    summary = Column(Text)
    key_entities = Column(JSON)  # Stores {people: [], organizations: [], locations: []}
    sections = Column(JSON)      # Stores list of section titles
    quiz_data = Column(JSON)     # Stores the list of questions/options/answers
    related_topics = Column(JSON) # Stores list of related topics
    raw_html = Column(Text)       # Stores raw scraped HTML (Bonus requirement)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
