import os
import sys
import webbrowser
from app import app
import uvicorn

def run_app():
    # create scraped_content directory if it doesn't exist
    if not os.path.exists('scraped_content'):
        os.makedirs('scraped_content')
    
    # start server
    port = 8000
    url = f"http://localhost:{port}"
    
    # open browser
    webbrowser.open(url)
    
    # run FastAPI
    uvicorn.run(app, host="127.0.0.1", port=port)

if __name__ == "__main__":
    run_app() 