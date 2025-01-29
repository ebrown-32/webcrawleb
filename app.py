from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
import uvicorn
from pathlib import Path
import scrape
import asyncio
import logging

app = FastAPI(title="Web Scraper", version="1.0.0")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Data models
class ScrapeRequest(BaseModel):
    url: HttpUrl

class ScrapeResponse(BaseModel):
    success: bool
    message: str
    file_path: str | None = None
    markdown_content: str | None = None

@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

@app.post("/api/scrape", response_model=ScrapeResponse)
async def scrape_endpoint(request: ScrapeRequest):
    logger = logging.getLogger(__name__)
    output_dir = Path("scraped_content")
    
    try:
        success = await scrape.scrape_url(str(request.url), output_dir, logger)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to scrape URL")
            
        # Get the latest file from the output directory
        files = list(output_dir.glob("*.md"))
        if not files:
            raise HTTPException(status_code=500, detail="File was not created")
            
        latest_file = max(files, key=lambda x: x.stat().st_mtime)
        markdown_content = latest_file.read_text(encoding='utf-8')
        
        return ScrapeResponse(
            success=True,
            message=f"Content scraped successfully! File saved as: {latest_file.name}",
            file_path=str(latest_file),
            markdown_content=markdown_content
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 