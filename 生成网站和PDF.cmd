@echo off
setlocal
cd /d "%~dp0"

rem Existing command windows do not pick up newly added user PATH entries.
if exist "D:\NodeJS\node-v24.22.2-win-x64\npm.cmd" (
  set "PATH=D:\NodeJS\node-v24.22.2-win-x64;%PATH%"
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is required. Install it and run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\vite" (
  call npm ci
  if errorlevel 1 goto failed
)

call npm run build
if errorlevel 1 goto failed

echo.
echo Done. PDF: public\resume.pdf  Website: dist\
pause
exit /b 0

:failed
echo.
echo Build failed. Please read the error above.
pause
exit /b 1
