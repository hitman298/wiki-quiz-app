import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Dict

# Define Pydantic models for structured output
class Question(BaseModel):
    question: str = Field(description="The question text")
    options: List[str] = Field(description="List of 4 options")
    answer: str = Field(description="The correct answer")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")
    explanation: str = Field(description="Short explanation of the answer")

class QuizOutput(BaseModel):
    summary: str = Field(description="A concise summary of the article")
    key_entities: Dict[str, List[str]] = Field(description="Key entities categorized by people, organizations, locations")
    quiz: List[Question] = Field(description="List of 5-10 quiz questions")
    related_topics: List[str] = Field(description="List of related Wikipedia topics")

def generate_quiz(text_content: str):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not found in environment variables")

    llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key, temperature=0.3)
    
    parser = PydanticOutputParser(pydantic_object=QuizOutput)
    
    prompt = PromptTemplate(
        template="""
        You are an expert educational AI. Your task is to analyze the following Wikipedia article text and generate a quiz, summary, and extract key entities.
        
        Article Text:
        {text}
        
        {format_instructions}
        
        Requirements:
        1. Generate a concise summary of the article (max 150 words).
        2. Extract key entities (People, Organizations, Locations) that are central to the text.
        3. Generate 5-10 multiple-choice questions based STRICTLY on the provided text.
           - Each question must have exactly 4 options.
           - Include the correct answer which must be explicitly supported by the text.
           - Provide a short explanation citing the section or context.
           - Mark difficulty (easy, medium, hard) - ensure a mix of difficulties.
        4. Suggest 3-5 related Wikipedia topics.
        
        CRITICAL: Do not halluncinate information. If the text does not contain enough info, generate fewer questions.
        Ensure the output is valid JSON matching the instructions.
        """,
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"text": text_content})
        return result
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise e
