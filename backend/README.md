# AI-Court Backend

A Node.js/Express.js backend for the AI-Court legal-tech platform with Firebase authentication and role-based access control.

## 🏗️ Project Structure

```
backend/
├── config/
│   └── firebase.js          # Firebase Admin SDK configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── cases.js             # Case management routes
├── server.js                # Main server file
├── package.json
├── .env                     # Environment variables
└── README.md
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Firebase Admin SDK Configuration
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔐 Authentication System

### Firebase Integration
- **Client-side**: Uses Firebase Authentication for signup/login
- **Server-side**: Uses Firebase Admin SDK for token verification
- **Session Management**: JWT tokens for session persistence

### Role-Based Access Control (RBAC)
- **User Role**: Citizens filing disputes
- **Court Role**: Court officials managing cases

### Authentication Flow
1. User signs up/logs in via Firebase (frontend)
2. Frontend sends Firebase ID token to backend
3. Backend verifies token using Firebase Admin SDK
4. Backend returns user profile and role information
5. Frontend stores role and manages protected routes

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /verify` - Verify Firebase token
- `GET /user/profile` - Get user profile (protected)
- `GET /court/profile` - Get court profile (protected)

### Case Management Routes (`/api/cases`)
- `GET /user` - Get user cases (protected, user role)
- `GET /court` - Get court cases (protected, court role)
- `GET /:caseId` - Get case details by ID (protected)

### Health Check
- `GET /` - API health check

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Firebase Token Verification**: Secure authentication
- **Role-Based Access**: Different endpoints for different user types

## 🔧 Middleware

### Authentication Middleware (`middleware/auth.js`)
- `verifyFirebaseToken`: Verifies Firebase ID tokens
- `requireRole`: Checks user role permissions

### Security Middleware
- `helmet`: Security headers
- `morgan`: Request logging
- `rateLimit`: Rate limiting
- `cors`: Cross-origin resource sharing

## 📊 Error Handling

- **Global Error Handler**: Catches all unhandled errors
- **404 Handler**: Handles undefined routes
- **Validation**: Input validation and sanitization
- **Logging**: Comprehensive error logging

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Firebase Setup
1. Create Firebase project
2. Generate service account key
3. Add Firebase configuration to environment variables

### Security Considerations
- Use strong JWT secrets
- Enable Firebase App Check
- Implement proper CORS policies
- Use HTTPS in production

## 🔄 Development Workflow

1. **Local Development**: `npm run dev`
2. **Testing**: Test endpoints with Postman/Insomnia
3. **Frontend Integration**: Ensure CORS is properly configured
4. **Deployment**: Deploy to your preferred platform

## 📝 API Documentation

### Request Headers
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
``` 