@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Fixlinx Industrial - Dev Launcher

set "ROOT=%~dp0"
set "PORT=3000"
cd /d "%ROOT%"

:: dev.bat / start.bat may live next to the project or one level above it
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
echo   Fixlinx Industrial - Dev Mode (next dev, hot reload)
echo ============================================================
echo.

if not exist "node_modules" (
    echo Installing dependencies ...
    call npm install || goto :fail
)

echo Starting dev server at http://localhost:%PORT% ...
echo   Hot reload enabled. Press Ctrl+C to stop.
echo   Browser opens automatically.
echo ============================================================
echo.

start "" /b powershell -Command "Start-Sleep -Seconds 3; Start-Process http://localhost:%PORT%"

call npm run dev
goto :eof

:fail
echo.
echo ============================================================
echo   FAILED. See messages above.
echo ============================================================
endlocal
pause
exit /b 1
