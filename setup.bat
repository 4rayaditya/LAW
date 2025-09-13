@echo off
echo 🚀 Setting up NyaySphere - Indian Judicial Platform
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first.
    pause
    exit /b 1
)

echo ✅ PostgreSQL detected

REM Backend setup
echo.
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please update .env file with your database and API credentials
)

REM Database setup
echo Setting up database...
call npx prisma migrate dev --name init
call npx prisma generate

REM Seed database
echo Seeding database with sample data...
call npm run db:seed

echo ✅ Backend setup complete

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd ..\frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete

REM Create startup script
echo.
echo 📝 Creating startup script...
cd ..
echo @echo off > start.bat
echo echo 🚀 Starting NyaySphere... >> start.bat
echo. >> start.bat
echo echo Starting backend server... >> start.bat
echo cd backend >> start.bat
echo start "Backend" cmd /k "npm run dev" >> start.bat
echo timeout /t 5 /nobreak ^>nul >> start.bat
echo. >> start.bat
echo echo Starting frontend server... >> start.bat
echo cd ..\frontend >> start.bat
echo start "Frontend" cmd /k "npm run dev" >> start.bat
echo. >> start.bat
echo echo ✅ NyaySphere is running! >> start.bat
echo echo Frontend: http://localhost:5173 >> start.bat
echo echo Backend: http://localhost:3001 >> start.bat
echo echo. >> start.bat
echo echo Demo Credentials: >> start.bat
echo echo Judge: judge1@nyaysphere.in / password123 >> start.bat
echo echo Lawyer: lawyer1@nyaysphere.in / password123 >> start.bat
echo echo Client: client1@example.com / password123 >> start.bat
echo pause >> start.bat

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your database and API credentials
echo 2. Start MinIO server (or configure AWS S3)
echo 3. Get a Google Gemini API key
echo 4. Run 'start.bat' to start the application
echo.
echo For detailed setup instructions, see README.md
pause
