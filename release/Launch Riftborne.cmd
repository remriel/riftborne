@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto missing_node
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 22 ? 0 : 1)"
if errorlevel 1 goto missing_node
node serve-release.mjs
if errorlevel 1 pause
exit /b %errorlevel%

:missing_node
echo Install Node.js 22 or newer, then launch again.
pause
exit /b 1
