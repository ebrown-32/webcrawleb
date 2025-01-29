FROM mcr.microsoft.com/devcontainers/python:3

# Install Wine and Windows dependencies
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y wine wine32 wine64 && \
    apt-get clean

# Install Python for Windows
RUN mkdir -p /wine/drive_c/Python312 && \
    wget https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe -O /tmp/python.exe && \
    wine /tmp/python.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0 && \
    rm /tmp/python.exe 