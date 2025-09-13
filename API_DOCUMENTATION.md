# NyaySphere API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All API endpoints (except login/register) require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (if any)"
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new client account.

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "CLIENT"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "client@example.com",
    "name": "John Doe",
    "role": "CLIENT",
    "createdAt": "2025-01-13T10:00:00Z"
  },
  "token": "jwt-token"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "lawyer@nyaysphere.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "lawyer@nyaysphere.in",
    "name": "Advocate John",
    "role": "LAWYER",
    "barId": "RJ/2020/001"
  },
  "token": "jwt-token"
}
```

### GET /auth/me
Get current user profile.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "LAWYER",
    "barId": "RJ/2020/001",
    "createdAt": "2025-01-13T10:00:00Z"
  }
}
```

---

## Case Management Endpoints

### POST /cases
Create a new case (Lawyer only).

**Request Body:**
```json
{
  "title": "State vs John Doe - Murder Case",
  "type": "Criminal",
  "subtype": "Murder",
  "clientId": "client-uuid",
  "judgeId": "judge-uuid",
  "urgency": "HIGH",
  "hearingDate": "2025-10-15T10:00:00Z",
  "description": "Case involving alleged murder",
  "ipcSections": [
    {
      "sectionCode": "302",
      "description": "Murder - Punishment for murder"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Case created successfully",
  "case": {
    "id": "case-uuid",
    "caseNumber": "CASE-2025-000001",
    "title": "State vs John Doe - Murder Case",
    "type": "Criminal",
    "subtype": "Murder",
    "status": "ACTIVE",
    "urgency": "HIGH",
    "hearingDate": "2025-10-15T10:00:00Z",
    "judge": { "id": "uuid", "name": "Justice Smith" },
    "lawyer": { "id": "uuid", "name": "Advocate John" },
    "client": { "id": "uuid", "name": "John Doe" },
    "ipcSections": [...]
  }
}
```

### GET /cases/lawyer/:id
Get cases for a lawyer.

**Query Parameters:**
- `status` (optional): ACTIVE, CLOSED, PENDING
- `urgency` (optional): HIGH, MEDIUM, LOW
- `type` (optional): Criminal, Civil, etc.
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "cases": [
    {
      "id": "case-uuid",
      "caseNumber": "CASE-2025-000001",
      "title": "Case Title",
      "status": "ACTIVE",
      "urgency": "HIGH",
      "hearingDate": "2025-10-15T10:00:00Z",
      "judge": { "id": "uuid", "name": "Judge Name" },
      "client": { "id": "uuid", "name": "Client Name" },
      "_count": {
        "documents": 5,
        "documentRequests": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /cases/client/:id
Get cases for a client.

**Response:**
```json
{
  "cases": [
    {
      "id": "case-uuid",
      "caseNumber": "CASE-2025-000001",
      "title": "Case Title",
      "status": "ACTIVE",
      "urgency": "HIGH",
      "hearingDate": "2025-10-15T10:00:00Z",
      "lawyer": { "id": "uuid", "name": "Lawyer Name", "barId": "RJ/2020/001" },
      "judge": { "id": "uuid", "name": "Judge Name" },
      "documentRequests": [
        {
          "id": "request-uuid",
          "documentType": "FIR",
          "description": "First Information Report",
          "isCompleted": false,
          "requestedAt": "2025-01-13T10:00:00Z"
        }
      ]
    }
  ]
}
```

### GET /cases/judge/:id
Get cases for a judge.

**Response:**
```json
{
  "cases": [
    {
      "id": "case-uuid",
      "caseNumber": "CASE-2025-000001",
      "title": "Case Title",
      "status": "ACTIVE",
      "urgency": "HIGH",
      "hearingDate": "2025-10-15T10:00:00Z",
      "lawyer": { "id": "uuid", "name": "Lawyer Name", "barId": "RJ/2020/001" },
      "client": { "id": "uuid", "name": "Client Name" },
      "documents": [
        {
          "id": "doc-uuid",
          "fileName": "document.pdf",
          "documentType": "FIR",
          "sharedWithJudgeAt": "2025-01-13T10:00:00Z"
        }
      ]
    }
  ]
}
```

### GET /cases/:id
Get detailed case information.

**Response:**
```json
{
  "case": {
    "id": "case-uuid",
    "caseNumber": "CASE-2025-000001",
    "title": "Case Title",
    "type": "Criminal",
    "subtype": "Murder",
    "status": "ACTIVE",
    "urgency": "HIGH",
    "hearingDate": "2025-10-15T10:00:00Z",
    "description": "Case description",
    "judge": { "id": "uuid", "name": "Judge Name", "email": "judge@example.com" },
    "lawyer": { "id": "uuid", "name": "Lawyer Name", "email": "lawyer@example.com" },
    "client": { "id": "uuid", "name": "Client Name", "email": "client@example.com" },
    "ipcSections": [
      {
        "ipcSection": {
          "sectionCode": "302",
          "description": "Murder - Punishment for murder"
        }
      }
    ],
    "documents": [...],
    "documentRequests": [...]
  }
}
```

---

## Document Management Endpoints

### POST /documents/upload/:caseId
Upload a document (Client only).

**Request:** Multipart form data
- `document`: File
- `documentType`: String
- `extractedText`: String (optional)

**Response:**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "doc-uuid",
    "fileName": "document.pdf",
    "fileUrl": "storage-url",
    "documentType": "FIR",
    "extractedText": "Extracted text content",
    "isApprovedByLawyer": false,
    "isSharedWithJudge": false,
    "uploadedAt": "2025-01-13T10:00:00Z",
    "uploadedBy": { "id": "uuid", "name": "Client Name", "role": "CLIENT" }
  }
}
```

### GET /documents/case/:caseId
Get documents for a case.

**Query Parameters:**
- `approved` (optional): true/false
- `shared` (optional): true/false

**Response:**
```json
{
  "documents": [
    {
      "id": "doc-uuid",
      "fileName": "document.pdf",
      "fileUrl": "storage-url",
      "documentType": "FIR",
      "extractedText": "Extracted text",
      "isApprovedByLawyer": true,
      "isSharedWithJudge": false,
      "uploadedAt": "2025-01-13T10:00:00Z",
      "uploadedBy": { "id": "uuid", "name": "User Name", "role": "CLIENT" }
    }
  ]
}
```

### PUT /documents/:docId/approve
Approve or reject a document (Lawyer only).

**Request Body:**
```json
{
  "approved": true
}
```

**Response:**
```json
{
  "message": "Document approved successfully",
  "document": {
    "id": "doc-uuid",
    "fileName": "document.pdf",
    "isApprovedByLawyer": true,
    "approvedAt": "2025-01-13T10:00:00Z"
  }
}
```

### POST /documents/share-with-judge
Share documents with judge (Lawyer only).

**Request Body:**
```json
{
  "documentIds": ["doc-uuid-1", "doc-uuid-2"]
}
```

**Response:**
```json
{
  "message": "2 documents shared with judge successfully",
  "sharedCount": 2
}
```

### GET /documents/:docId/download
Get signed download URL for a document.

**Response:**
```json
{
  "downloadUrl": "signed-url",
  "fileName": "document.pdf",
  "expiresIn": 3600
}
```

### POST /documents/request/:caseId
Request a document from client (Lawyer only).

**Request Body:**
```json
{
  "documentType": "FIR",
  "description": "First Information Report filed with police"
}
```

**Response:**
```json
{
  "message": "Document request created successfully",
  "request": {
    "id": "request-uuid",
    "documentType": "FIR",
    "description": "First Information Report filed with police",
    "isCompleted": false,
    "requestedAt": "2025-01-13T10:00:00Z",
    "requestedBy": { "id": "uuid", "name": "Lawyer Name" }
  }
}
```

---

## AI Endpoints

### POST /ai/query/:caseId
Query AI about case documents (Lawyer only).

**Request Body:**
```json
{
  "query": "Summarize the FIR and identify key evidence"
}
```

**Response:**
```json
{
  "query": "Summarize the FIR and identify key evidence",
  "response": "Based on the FIR document, the case involves...",
  "documentsProcessed": 3,
  "timestamp": "2025-01-13T10:00:00Z"
}
```

### GET /ai/predict/:caseId
Get predictive analysis for a case (Lawyer only).

**Response:**
```json
{
  "caseId": "case-uuid",
  "analysis": {
    "prediction": "Based on historical data for similar cases...",
    "confidence": "78%",
    "recommendations": [
      "File for bail application within 7 days",
      "Request detailed forensic report",
      "Gather witness statements"
    ]
  },
  "generatedAt": "2025-01-13T10:00:00Z",
  "note": "This is a mock analysis for demonstration"
}
```

### GET /ai/insights/:caseId
Get case insights and statistics (Lawyer only).

**Response:**
```json
{
  "caseId": "case-uuid",
  "summary": {
    "totalDocuments": 5,
    "approvedDocuments": 3,
    "sharedDocuments": 2,
    "pendingRequests": 1,
    "completedRequests": 2,
    "approvalRate": 60,
    "completionRate": 67
  },
  "documentBreakdown": {
    "FIR": 1,
    "Medical Report": 2,
    "Aadhaar": 1,
    "Other": 1
  },
  "timeline": {
    "caseCreated": "2025-01-01T10:00:00Z",
    "lastDocumentUpload": "2025-01-13T10:00:00Z",
    "hearingDate": "2025-10-15T10:00:00Z"
  },
  "recommendations": [
    "Complete 1 pending document requests",
    "Share approved documents with judge"
  ]
}
```

---

## User Management Endpoints

### GET /users
Get all users (Judge and Lawyer only).

**Query Parameters:**
- `role` (optional): JUDGE, LAWYER, CLIENT
- `search` (optional): Search by name, email, barId, courtId
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "LAWYER",
      "barId": "RJ/2020/001",
      "createdAt": "2025-01-13T10:00:00Z",
      "_count": {
        "casesAsJudge": 0,
        "casesAsLawyer": 5,
        "casesAsClient": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### GET /users/:id
Get user by ID.

**Response:**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "LAWYER",
    "barId": "RJ/2020/001",
    "createdAt": "2025-01-13T10:00:00Z",
    "_count": {
      "casesAsJudge": 0,
      "casesAsLawyer": 5,
      "casesAsClient": 0
    }
  }
}
```

### GET /users/:id/stats
Get user statistics.

**Response:**
```json
{
  "userId": "user-uuid",
  "stats": {
    "totalCases": 5,
    "activeCases": 3,
    "closedCases": 1,
    "pendingCases": 1,
    "totalDocuments": 15,
    "approvedDocuments": 12,
    "approvalRate": 80
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Case not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## File Upload Limits
- Maximum file size: 10MB
- Supported formats: PDF, JPG, PNG, DOC, DOCX, TXT
- Files are stored securely with signed URLs for access

## Security Features
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers (Helmet.js)
