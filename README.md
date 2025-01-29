# URL to Markdown

An intuitive web application that converts web pages into markdown format - perfect for AI analysis and content processing.

## Features

- 🔄 Convert any webpage to markdown format
- 🎨 Clean, modern interface with light/dark mode
- 💾 Save and manage previous conversions
- 🤖 AI-friendly output format
- 🚀 Fast and efficient processing

## Installation
I would recommend using a virtual environment or dev container to run this project.

1. Clone the repository:
   ```bash
   git clone https://github.com/ebrown-32/webcrawleb
   cd url-to-markdown
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a directory for scraped content:
   ```bash
   mkdir scraped_content
   ```

## Usage

1. Start the server:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

3. Enter a URL in the input field and click "Scrape" or press Enter.

4. The webpage will be converted to markdown format and displayed below.

5. Previous conversions are automatically saved and can be:
   - Viewed by clicking the "View" button
   - Deleted by clicking the "Delete" button

## Technical Details

- Backend: FastAPI (Python)
- Frontend: Vanilla JavaScript
- Styling: Custom CSS with theme support
- Markdown Processing: marked.js
- Code Highlighting: highlight.js
- Web Scraping: crawl4ai

## Dependencies

- Python 3.7+
- FastAPI
- uvicorn
- crawl4ai
- Other dependencies listed in `requirements.txt`

## Project Structure 

```
url-to-markdown/
├── app.py              # fastAPI
├── requirements.txt    # dependencies
├── scraped_content/   # results
└── static/
    ├── index.html     # frontend
    ├── styles.css     # styling
    └── script.js      # logic
```

## Development

To run the application in development mode with auto-reload:
```bash
uvicorn app:app --reload
```

## Credits

- Built by [Eli Brown](https://elibrown.info)
- Powered by [crawl4ai](https://github.com/unclecode/crawl4ai) <--- All of the heavy lifting

## License

MIT License 