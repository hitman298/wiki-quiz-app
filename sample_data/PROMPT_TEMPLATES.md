# LangChain Prompt Templates

The following prompt templates are used in `app/llm_service.py` to generate the quiz content using the Llama 3 model.

## Main Quiz Generation Prompt

```python
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
```

## Logic Explanation

*   **Role**: Educational AI.
*   **Input**: Scraped text from Wikipedia (`text`).
*   **Constraints**: "STRICTLY on the provided text" to prevent hallucination.
*   **Output Format**: Enforced via LangChain's `PydanticOutputParser` to ensure valid JSON structure for the frontend.
