@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 22 or newer, then launch again.
 pause
 exit /b 1
)
if not exist node_modules call npm install
call npm run dev -- --open
