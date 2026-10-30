@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Fixlinx Industrial - One-Click Launcher

set "ROOT=%~dp0"
set "PORT=3000"
cd /d "%ROOT%"

:: start.bat / dev.bat may live next to the project or one level above it
if not exist "package.json" (
    if exist "..\package.json" (
        cd /d ".."
        set "ROOT=."
    ) else (
        echo package.json not found in this folder or its parent.
        goto :fail
    )
)

echo ============================================================
echo   Fixlinx Industrial - One-Click Launcher
echo ============================================================
echo.

:: 1. Install dependencies if first run
if not exist "node_modules" (
    echo [1/4] Installing dependencies ...
    call npm install || goto :fail
) else (
    echo [1/4] Dependencies present
)
echo.

:: 2. Build production
echo [2/4] Building production bundle ...
call npm run build || goto :fail
echo       build OK
echo.

:: 2b. Regenerate asset catalog
echo [2b] Regenerating asset catalog ...
if exist "C:\Users\JM.RADE\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" (
    "C:\Users\JM.RADE\.dsh\dsh-primary-runtime\dependencies\python\python.exe" "%ROOT%build-asset-catalog.py"
    if errorlevel 1 (
        echo       catalog regeneration failed — continuing with existing catalog
    ) else (
        echo       catalog updated
    )
) else (
    echo       Python runtime not found — skipping catalog refresh
)
echo.

:: 3. Free port 3000 if occupied
echo [3/4] Checking port %PORT% ...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo       freed port %PORT%
)
timeout /t 1 /nobreak >nul

:: 4. Start server and open browser
echo [4/4] Starting server at http://localhost:%PORT% ...
echo       Browser opens automatically. Keep this window open.
echo       Press Ctrl+C to stop the server.
echo ============================================================
echo.

:: Open browser after a short delay so the server is ready
start "" /b powershell -Command "Start-Sleep -Seconds 4; Start-Process http://localhost:%PORT%"

:: Run next in the foreground (live logs visible)
call npm start
goto :eof

:fail
echo.
echo ============================================================
echo   FAILED. See messages above.
echo ============================================================
endlocal
pause
exit /b 1
