#!/bin/bash

echo "🚀 Setting up NyaySphere - Indian Judicial Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ PostgreSQL detected"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your database and API credentials"
fi

# Database setup
echo "Setting up database..."
npx prisma migrate dev --name init
npx prisma generate

# Seed database
echo "Seeding database with sample data..."
npm run db:seed

echo "✅ Backend setup complete"

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete"

# Create startup script
echo ""
echo "📝 Creating startup script..."
cd ..
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting NyaySphere..."

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ NyaySphere is running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"
echo ""
echo "Demo Credentials:"
echo "Judge: judge1@nyaysphere.in / password123"
echo "Lawyer: lawyer1@nyaysphere.in / password123"
echo "Client: client1@example.com / password123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database and API credentials"
echo "2. Start MinIO server (or configure AWS S3)"
echo "3. Get a Google Gemini API key"
echo "4. Run './start.sh' to start the application"
echo ""
echo "For detailed setup instructions, see README.md"
