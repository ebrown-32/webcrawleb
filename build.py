import PyInstaller.__main__
import os
import site
import fake_http_header

# Get the site-packages directory
site_packages = site.getsitepackages()[0]

# Get the directory containing static files
static_dir = os.path.abspath("static")

# Get the path to fake_http_header data
fake_http_header_path = os.path.dirname(fake_http_header.__file__)

PyInstaller.__main__.run([
    'main.py',
    '--name=URL-to-Markdown',
    '--onefile',
    '--windowed',
    f'--add-data={static_dir}{os.pathsep}static',
    f'--add-data={fake_http_header_path}/data{os.pathsep}fake_http_header/data',
    '--hidden-import=fake_http_header.data',
    '--hidden-import=playwright._impl._api_types',
    '--hidden-import=playwright._impl._connection',
    '--hidden-import=playwright._impl._browser',
    '--collect-all=fake_http_header',
    '--collect-all=playwright_stealth',
    '--collect-all=crawl4ai',
    '--clean',
]) 