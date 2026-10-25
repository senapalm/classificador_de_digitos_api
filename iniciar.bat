@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Ambiente virtual nao encontrado.
    echo Execute primeiro: python -m venv .venv
    pause
    exit /b 1
)

call .venv\Scripts\activate.bat

python -m uvicorn app.main:app --reload

pause