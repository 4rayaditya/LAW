# NyaySphere - Indian Judicial Platform

NyaySphere is a comprehensive, AI-powered platform designed specifically for the Indian judicial system. It serves three key roles: Judges, Lawyers, and Clients, providing secure case management, document handling, and AI-powered legal analysis.

## 🌟 Features

### Core Functionality
- **Multi-Role Platform**: Dedicated interfaces for Judges, Lawyers, and Clients
- **Case Management**: Complete case lifecycle management with IPC section tracking
- **Document Management**: Secure document upload, approval, and sharing workflow
- **AI-Powered Analysis**: Google Gemini integration for document analysis and case insights
- **Document Scanning**: OCR capabilities using Tesseract.js for mobile document capture
- **Multilingual Support**: English and Hindi language support
- **Real-time Updates**: Live case status and document tracking

### Role-Specific Features

#### For Lawyers
- Create and manage cases
- Request documents from clients
- Approve/reject uploaded documents
- Share approved documents with judges
- AI-powered case analysis and insights
- Predictive case outcome analysis

#### For Clients
- View assigned cases
- Upload requested documents
- Scan documents using mobile camera
- Track case progress
- Receive document requests from lawyers

#### For Judges
- Review assigned cases
- Access shared documents from lawyers
- Update case status
- Schedule hearings
- Monitor case progress

## 🛠 Tech Stack

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** database with Prisma ORM
- **JWT** authentication
- **Google Gemini AI** for document analysis
- **MinIO/S3** compatible file storage
- **PDF parsing** and text extraction

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **React Query** for data fetching
- **Tesseract.js** for OCR
- **i18next** for internationalization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- MinIO server (or AWS S3 compatible storage)
- Google Gemini API key

### Backend Setup

1. **Clone and install dependencies**
   ```bash
   cd nyaysphere-backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nyaysphere"
   JWT_SECRET="your-super-secret-jwt-key-here"
   GEMINI_API_KEY="your-gemini-api-key-here"
   STORAGE_ENDPOINT="http://localhost:9000"
   STORAGE_ACCESS_KEY="minioadmin"
   STORAGE_SECRET_KEY="minioadmin"
   STORAGE_BUCKET="nyaysphere-documents"
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run db:seed
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔐 Demo Credentials

The seed script creates sample users for testing:

| Role | Email | Password |
|------|-------|----------|
| Judge | judge1@nyaysphere.in | password123 |
| Lawyer | lawyer1@nyaysphere.in | password123 |
| Client | client1@example.com | password123 |

## 📱 Key Features in Detail

### AI-Powered Document Analysis
- Upload PDFs and scanned documents
- Automatic text extraction using OCR
- Natural language queries about case documents
- AI-generated case summaries and insights
- Predictive analysis for case outcomes

### Document Workflow
1. **Lawyer** creates case and requests specific documents
2. **Client** uploads or scans requested documents
3. **Lawyer** reviews and approves/rejects documents
4. **Lawyer** shares approved documents with judge
5. **Judge** accesses shared documents for case review

### Security Features
- JWT-based authentication
- Role-based access control
- Secure file storage with signed URLs
- Data localization compliance for India
- Rate limiting and security headers

### Mobile-First Design
- Responsive design for all devices
- Document scanning with camera
- Touch-friendly interface
- Offline capability for viewing cases

## 🏗 Architecture

### Database Schema
- **Users**: Judges, Lawyers, Clients with role-based permissions
- **Cases**: Complete case information with IPC sections
- **Documents**: File metadata with approval workflow
- **IPC Sections**: Indian Penal Code section database
- **Document Requests**: Lawyer-to-client document requests

### API Endpoints
- **Authentication**: `/api/auth/*` - Login, register, profile management
- **Cases**: `/api/cases/*` - Case CRUD operations
- **Documents**: `/api/documents/*` - Document upload, approval, sharing
- **AI**: `/api/ai/*` - AI analysis and predictions
- **Users**: `/api/users/*` - User management

## 🌐 Deployment

### Production Considerations
- Use a production PostgreSQL database
- Set up MinIO or AWS S3 for file storage
- Configure proper CORS settings
- Set up SSL certificates
- Use environment-specific configurations
- Implement proper logging and monitoring

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔮 Future Enhancements

- **Video Conferencing**: Integrated court hearings
- **Blockchain**: Immutable case records
- **Mobile App**: Native iOS/Android applications
- **Advanced AI**: More sophisticated legal analysis
- **Integration**: Court management system integration
- **Analytics**: Comprehensive case analytics dashboard

---

**Built with ❤️ for the Indian Judicial System**
