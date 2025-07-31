# AI-Court Legal-Tech Platform

A comprehensive legal-tech platform for resolving civil legal disputes using AI and virtual mediation. Built for the Coxiant hackathon to reduce court backlog in India.

## 🏗️ Architecture

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js/Express with Firebase Authentication
- **ML/AI Layer**: Separate folder (handled by another teammate)
- **Database**: MongoDB (planned)
- **Authentication**: Firebase Auth + JWT tokens

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI_Court
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure your Firebase credentials in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Update Firebase config in src/config/firebase.js
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 Features

### 🔐 Authentication & Authorization
- **Firebase Authentication**: Email/password and Google sign-in
- **Role-based Access**: Separate interfaces for Users and Court Officials
- **JWT Token Management**: Secure session handling
- **Protected Routes**: Role-specific access control

### 👤 User Features
- **Landing Page**: Choose role and get started
- **Dashboard**: Case overview, statistics, and quick actions
- **File Dispute**: Chat-based dispute filing interface
- **AI Suggestions**: Legal advice, IPC sections, case precedents
- **Mediation**: Schedule and attend virtual mediations
- **Documents**: View and manage legal documents
- **Case History**: Track case progress with search/filter

### 🏛️ Court Features
- **Dashboard**: Court case management overview
- **Review Cases**: Review pending case submissions
- **Schedule**: Schedule hearings and mediations
- **Documents**: Generate legal documents and orders
- **Calendar**: Manage court calendar and proceedings

### 🔒 Security Features
- **Document Safety**: SHA-256 hashing and AES encryption
- **E-Signing**: Integration with DocuSign and Aadhaar eSign
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Secure cross-origin requests

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Firebase** - Authentication and backend services
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **JWT** - Token-based authentication
- **Helmet** - Security headers
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 📁 Project Structure

```
AI_Court/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (AuthContext)
│   │   ├── pages/          # Page components
│   │   ├── config/         # Configuration files
│   │   └── App.jsx         # Main app with routing
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── package.json
│   ├── env.example         # Environment variables template
│   └── README.md
├── airelatedstuff/          # ML/AI components (separate team)
└── README.md               # This file
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Download service account key for backend
4. Update configuration files:
   - Frontend: `frontend/src/config/firebase.js`
   - Backend: `backend/.env`

### Environment Variables
Backend (`backend/.env`):
```env
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase credentials
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting platform
```

### Backend Deployment
```bash
cd backend
npm install --production
# Deploy to your preferred platform (Heroku, Railway, etc.)
```

## 🔄 Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Implement frontend and backend changes
   - Test authentication and role-based access
   - Update documentation

2. **Testing**:
   - Test user flows (signup → login → dashboard)
   - Test role-based access control
   - Test mobile responsiveness
   - Test API endpoints

3. **Deployment**:
   - Build frontend for production
   - Deploy backend with environment variables
   - Update Firebase configuration
   - Test live deployment

## 🤝 Contributing

1. **Code Style**: Follow existing patterns
2. **Authentication**: Always use role-based protection
3. **UI/UX**: Maintain legal-themed, trustworthy design
4. **Testing**: Test both user and court flows
5. **Documentation**: Update README files

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized navigation
- Progressive Web App features

## 🔐 Security Considerations

- Firebase Authentication for secure user management
- JWT tokens for session handling
- Rate limiting on API endpoints
- CORS configuration for secure requests
- Environment variable protection
- Input validation and sanitization

## 🎯 Future Enhancements

- **AI Integration**: Connect with ML team's models
- **Database**: MongoDB integration for persistent data
- **Real-time**: WebSocket support for live updates
- **Notifications**: Push notifications for case updates
- **Analytics**: Case tracking and analytics dashboard
- **Multi-language**: Support for regional languages

## 📞 Support

For technical support or questions:
- Check the individual README files in `frontend/` and `backend/`
- Review Firebase documentation for authentication setup
- Test with the provided mock data

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Coxiant Hackathon** 🚀
*Reducing court backlog through AI-powered legal dispute resolution* 