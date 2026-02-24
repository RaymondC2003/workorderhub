@echo off
setlocal
cd /d "%~dp0"

echo === WorkOrderHub: install and run (backend + frontend) ===

set SHARED_KEY=dev-key-change-in-production

REM Backend .env
if not exist backend\.env (
  echo Creating backend\.env
  echo API_KEY=%SHARED_KEY%> backend\.env
  echo PORT=3001>> backend\.env
)

REM Frontend .env.local - use same key as backend (copy from backend if present)
if exist backend\.env (
  for /f "tokens=2 delims==" %%a in ('findstr /b "API_KEY=" backend\.env') do set API_KEY=%%a
)
if not defined API_KEY set API_KEY=%SHARED_KEY%
set API_KEY=%API_KEY: =%
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3001> frontend\.env.local
echo NEXT_PUBLIC_API_KEY=%API_KEY%>> frontend\.env.local
echo Using API key from backend for frontend (.env.local)

echo Installing backend dependencies...
pushd backend
call npm install
popd

echo Installing frontend dependencies...
pushd frontend
call npm install
popd

echo Starting backend in new window (http://localhost:3001)...
start "WorkOrderHub Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting frontend in new window (http://localhost:3000)...
start "WorkOrderHub Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo Close the backend and frontend windows to stop the servers.
pause
