import asyncio
import argparse
from pathlib import Path
from datetime import datetime
import logging
from crawl4ai import AsyncWebCrawler

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)

async def scrape_url(url: str, output_dir: Path, logger: logging.Logger):
    try:
        async with AsyncWebCrawler() as crawler:
            logger.info(f"Starting to scrape: {url}")
            result = await crawler.arun(url=url)
            
            if not result.markdown:
                logger.warning("No content was scraped")
                return False
                
            # Create output directory if it doesn't exist
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Save the markdown content
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            sanitized_url = url.replace("https://", "").replace("http://", "").replace("/", "_")
            filename = f"{timestamp}_{sanitized_url}.md"
            
            output_path = output_dir / filename
            output_path.write_text(result.markdown, encoding='utf-8')
            logger.info(f"Successfully saved content to: {output_path}")
            return True
            
    except Exception as e:
        logger.error(f"Error while scraping: {str(e)}")
        return False

async def main():
    parser = argparse.ArgumentParser(description="Web scraper that saves content as markdown")
    parser.add_argument("url", help="URL to scrape")
    parser.add_argument(
        "--output-dir", 
        type=Path, 
        default=Path("scraped_content"),
        help="Directory to save the markdown files (default: ./scraped_content)"
    )
    
    args = parser.parse_args()
    logger = setup_logging()
    
    success = await scrape_url(args.url, args.output_dir, logger)
    if not success:
        exit(1)

if __name__ == "__main__":
    asyncio.run(main())