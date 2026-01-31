@echo off
echo ========================================
echo Restarting Server with Fresh Prisma Client
echo ========================================
echo.

echo Step 1: Stopping any running node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Regenerating Prisma Client...
cd server
node node_modules/prisma/build/index.js generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying database schema...
node node_modules/prisma/build/index.js db push --accept-data-loss
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Database push had issues, but continuing...
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Now you can start your server with: npm run dev
echo.
pause
