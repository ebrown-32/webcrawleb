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

        // Reload file list
        loadPreviousFiles();

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

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load previous files
async function loadPreviousFiles() {
    try {
        const response = await fetch('/api/files');
        const files = await response.json();
        
        const filesGrid = document.getElementById('filesGrid');
        filesGrid.innerHTML = '';
        
        files.forEach(file => {
            const card = document.createElement('div');
            card.className = 'file-card';
            // Extract URL from filename by removing timestamp and .md
            const urlPart = file.name.replace(/^\d{8}_\d{6}_/, '').replace('.md', '');
            // Replace underscores with forward slashes
            const displayUrl = urlPart.replace(/_/g, '/');
            card.innerHTML = `
                <h3>${displayUrl}</h3>
                <p>${new Date(file.created * 1000).toLocaleString()}</p>
                <div class="file-actions">
                    <button onclick="viewFile('${file.name}', ${JSON.stringify(file.content).replace(/"/g, '&quot;')})">
                        View
                    </button>
                    <button class="delete-btn" onclick="deleteFile('${file.name}')">
                        Delete
                    </button>
                </div>
            `;
            filesGrid.appendChild(card);
        });
        
        if (files.length > 0) {
            document.getElementById('previousFiles').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

async function deleteFile(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
        return;
    }
    
    try {
        await fetch(`/api/files/${filename}`, {
            method: 'DELETE'
        });
        loadPreviousFiles();
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

function viewFile(filename, content) {
    const markdownContent = document.getElementById('markdownContent');
    const markdownRenderer = document.getElementById('markdownRenderer');
    const result = document.getElementById('result');

    // Clear any existing success/error messages
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');

    // Show the result container
    result.classList.remove('hidden');

    // Render the markdown
    markdownRenderer.innerHTML = marked.parse(content);
    markdownContent.classList.remove('hidden');
    
    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

    // Scroll to the content
    markdownContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Load previous files on page load
loadPreviousFiles();

// Modal functionality
const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');

infoButton.addEventListener('click', () => {
    infoModal.classList.add('visible');
    infoModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    infoModal.classList.remove('visible');
    setTimeout(() => {
        infoModal.classList.add('hidden');
    }, 300);
});

// Close modal when clicking outside
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        closeModal.click();
    }
});

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !infoModal.classList.contains('hidden')) {
        closeModal.click();
    }
}); 