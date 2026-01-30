import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    """
    Scrapes a Wikipedia article to extract title, text content, and raw HTML.
    
    Args:
        url (str): Valid Wikipedia URL.
        
    Returns:
        dict: Contains 'title', 'text' (cleaned), 'html' (raw), and 'sections'.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("Failed to fetch page")
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract Title
    title = soup.find(id="firstHeading").get_text()
    
    # Get Main Content
    content_div = soup.find(id="mw-content-text")
    paragraphs = content_div.find_all('p')
    text_content = ""
    for p in paragraphs:
        text_content += p.get_text()
        
    # Clean text (remove citations like [1])
    text_content = re.sub(r'\[\d+\]', '', text_content)
    
    # Extract Section Headers (H2) for context
    sections = []
    for header in content_div.find_all('h2'):
        span = header.find('span', class_='mw-headline')
        if span:
            sections.append(span.get_text())
            
    return {
        "title": title,
        "text": text_content[:15000], # Limit context window for LLM
        "html": str(content_div),      # Store raw HTML for bonus requirement
        "sections": sections
    }
