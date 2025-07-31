# AI-Court Platform

A modern legal tech platform for AI-powered dispute resolution and document management. Built with React, Node.js, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based access control (User/Court)
- Secure session management
- Profile management and password changes

### Document Management
- Upload and manage legal documents (PDF, DOC, DOCX, TXT)
- Document signing by court officials
- AI-powered document analysis
- Search and filter functionality
- Download and preview capabilities

### User Interface
- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Mobile-friendly interface
- Role-specific dashboards
- Real-time status updates

### Security
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI_Court
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/ai-court
# JWT_SECRET=your-super-secret-jwt-key
# FRONTEND_URL=http://localhost:5173

# Setup demo data
npm run setup

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👥 Demo Accounts

After running the setup script, you can use these demo accounts:

### User Account
- **Email:** user@example.com
- **Password:** password123
- **Role:** Citizen/User

### Court Account
- **Email:** court@example.com
- **Password:** password123
- **Role:** Court Official

## 📁 Project Structure

```
AI_Court/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── firebase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Document.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cases.js
│   │   └── documents.js
│   ├── scripts/
│   │   └── setup-demo.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/my-documents` - Get user's documents
- `GET /api/documents/all` - Get all documents (court only)
- `GET /api/documents/:id` - Get single document
- `GET /api/documents/:id/download` - Download document
- `PATCH /api/documents/:id/sign` - Sign document (court only)
- `PATCH /api/documents/:id/status` - Update document status
- `DELETE /api/documents/:id` - Delete document

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Express validator for all inputs
- **CORS Protection** - Configured for frontend domain
- **Rate Limiting** - Prevents abuse
- **Helmet Security** - Security headers
- **File Upload Security** - Type and size validation

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme support
- **Smooth Animations** - Framer Motion integration
- **Loading States** - User feedback during operations
- **Error Handling** - Graceful error messages
- **Accessibility** - ARIA labels and keyboard navigation

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (local or cloud)
2. Configure environment variables
3. Install dependencies: `npm install`
4. Run setup: `npm run setup`
5. Start server: `npm start`

### Frontend Deployment
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Deploy to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced AI document analysis
- [ ] Video conferencing integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Document versioning
- [ ] E-signature integration
- [ ] Payment processing

---

**Built with ❤️ by the AI-Court Team** 