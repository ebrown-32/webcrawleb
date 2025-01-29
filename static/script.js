async function scrapeUrl() {
    const urlInput = document.getElementById('urlInput');
    const scrapeButton = document.getElementById('scrapeButton');
    const buttonText = scrapeButton.querySelector('.button-text');
    const spinner = scrapeButton.querySelector('.spinner');
    const result = document.getElementById('result');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Validate URL
    if (!urlInput.value) {
        showError('Please enter a URL');
        return;
    }

    // Show loading state
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');
    scrapeButton.disabled = true;
    result.classList.add('hidden');

    try {
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: urlInput.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to scrape URL');
        }

        // Show success message
        successMessage.querySelector('span').textContent = data.message;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        result.classList.remove('hidden');

        // Render markdown content if available
        if (data.markdown_content) {
            const markdownContent = document.getElementById('markdownContent');
            const markdownRenderer = document.getElementById('markdownRenderer');
            markdownRenderer.innerHTML = marked.parse(data.markdown_content);
            markdownContent.classList.remove('hidden');
            
            // Highlight code blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }

    } catch (error) {
        // Show error message
        errorMessage.querySelector('span').textContent = error.message;
        successMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        document.getElementById('markdownContent').classList.add('hidden');
        result.classList.remove('hidden');
    } finally {
        // Reset button state
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
        scrapeButton.disabled = false;
    }
}

// Handle Enter key in URL input
document.getElementById('urlInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        scrapeUrl();
    }
}); 