
@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Ambiente virtual nao encontrado.
    echo Execute primeiro: python -m venv .venv
    pause
    exit /b 1
)

start "API MNIST" cmd /k "cd /d ""%~dp0"" && call "".venv\Scripts\activate.bat"" && python -m uvicorn app.main:app --reload"

timeout /t 3 /nobreak >nul

start "Frontend MNIST" cmd /k "cd /d ""%~dp0frontend"" && python -m http.server 5500"

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5500"

exit /b 0
