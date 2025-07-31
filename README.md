# AI-Court System

A comprehensive legal technology platform that combines AI-powered dispute resolution with traditional court management systems.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with MongoDB
- **Role-based Access**: Separate interfaces for users and court officials
- **AI-Powered Dispute Resolution**: Intelligent case analysis and suggestions
- **Document Management**: Secure file upload and management system
- **Case Tracking**: Complete case lifecycle management
- **Real-time Chat**: AI-powered legal assistance chatbot
- **Mediation Platform**: Online dispute resolution tools

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM

- **JWT** for session management
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with Vite

- **Axios** for API communication
- **Context API** for state management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)


## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI_Court
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-court

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production



# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```



### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Configuration

Create a `.env` file in the `frontend` directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api


```



### 4. Database Setup

Ensure MongoDB is running:

```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

### 5. Running the Application

#### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

#### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🔐 Authentication Flow

The system uses JWT-based authentication:

1. **JWT Authentication**: Primary authentication method for API access
2. **Session Management**: Automatic token refresh and session validation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/verify` - Verify JWT token

## 🚨 Troubleshooting

### Common Issues



#### 2. MongoDB Connection Failed

**Symptoms:** Database connection errors
**Solution:**
- Ensure MongoDB is running
- Check MongoDB connection string
- Verify network connectivity

#### 3. JWT Token Issues

**Symptoms:** Authentication failures, 401 errors
**Solution:**
- Check JWT_SECRET environment variable
- Ensure token is properly formatted
- Verify token expiration

#### 4. CORS Errors

**Symptoms:** Frontend can't connect to backend
**Solution:**
- Check FRONTEND_URL environment variable
- Ensure CORS configuration matches frontend URL
- Verify backend is running on correct port

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=*
```

### Logs

Check application logs for detailed error information:

```bash
# Backend logs
cd backend
npm run dev

# Frontend logs (in browser console)
F12 > Console
```

## 📁 Project Structure

```
AI_Court/
├── backend/
│   ├── config/
│   │   ├── database.js      # MongoDB configuration

│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Document.js      # Document model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── cases.js         # Case management routes
│   │   └── documents.js     # Document management routes
│   ├── scripts/
│   │   └── setup-demo.js    # Demo data setup
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/           # Page components
│   │   ├── config/

│   │   └── main.jsx         # React entry point
│   └── package.json
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Token Security**: Configurable expiration and secret
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security
- **Helmet.js**: Security headers middleware
- **Environment Variables**: Secure configuration management

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📝 API Documentation

### Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Error Responses

Standard error response format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [] // Optional validation errors
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the troubleshooting section
2. Review the logs for error details
3. Create an issue with detailed error information
4. Include environment details (without sensitive data)

## 🔄 Updates

### Recent Fixes


- ✅ Improved JWT token handling
- ✅ Enhanced error handling and validation
- ✅ Added comprehensive authentication flow
- ✅ Fixed CORS configuration
- ✅ Improved database connection handling
- ✅ Added security headers and rate limiting
- ✅ Enhanced user model with better validation
- ✅ Fixed frontend authentication context
- ✅ Added proper environment variable handling 