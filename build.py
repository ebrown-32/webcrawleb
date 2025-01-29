import PyInstaller.__main__
import os

# Get the directory containing static files
static_dir = os.path.abspath("static")

PyInstaller.__main__.run([
    'main.py',
    '--name=URL-to-Markdown',
    '--onefile',
    '--windowed',
    f'--add-data={static_dir}{os.pathsep}static',
    '--clean',
]) 