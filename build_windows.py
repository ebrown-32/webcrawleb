import subprocess
import os

# Get the directory containing static files
static_dir = os.path.abspath("static")

# Command to run PyInstaller through Wine
command = [
    'wine',
    'python',
    '-m',
    'PyInstaller',
    'main.py',
    '--name=URL-to-Markdown',
    '--onefile',
    '--windowed',
    f'--add-data={static_dir};static',  # Note: Windows uses ; instead of : for path separator
    '--icon=static/favicon.ico',
    '--clean',
]

# Run the build
subprocess.run(command) 