@echo off
REM Quick setup script for React app

echo.
echo ====================================
echo  FishingGear Pro - React Setup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version

echo.
echo Installing dependencies...
cd react-app
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Installation complete!
    echo.
    echo To start the development server, run:
    echo   cd react-app
    echo   npm run dev
    echo.
    echo Then open: http://localhost:5173
    echo.
    pause
) else (
    echo.
    echo ERROR: Installation failed!
    pause
    exit /b 1
)
