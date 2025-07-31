# AI-Court Frontend

React-based frontend for the AI-Court legal-tech platform with JWT authentication and role-based access control.

## Features

### 🔐 Authentication
- JWT Authentication with email/password
- Role-based access control (User vs Court Official)
- JWT token management for session handling
- Protected routes for different user types

### 👤 User Features
- **Dashboard**: Overview of cases, quick actions, and statistics
- **File Dispute**: Chat-based dispute filing interface
- **AI Suggestions**: Get legal advice, IPC sections, and case precedents
- **Mediation**: Schedule and attend virtual mediations
- **Documents**: View and manage legal documents
- **Case History**: Track case progress and history

### 🏛️ Court Features
- **Dashboard**: Court case management overview
- **Review Cases**: Review pending case submissions
- **Schedule**: Schedule hearings and mediations
- **Documents**: Generate legal documents and orders
- **Calendar**: Manage court calendar and proceedings

### 🎨 UI/UX
- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Mobile-friendly interface
- Legal-themed design with trustworthy appearance
- Role-specific navigation and branding

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn


### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example environment file
cp env.example .env
```

Update `.env` with your backend API configuration:
```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api

# Backend API URL
VITE_API_URL=http://localhost:5000
```



4. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx     # Role-based navigation
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Landing.jsx    # Main landing page
│   ├── Login.jsx      # Authentication pages
│   ├── Signup.jsx
│   ├── UserDashboard.jsx
│   ├── CourtDashboard.jsx
│   └── ...            # Other user/court pages
├── config/             # Configuration files

└── App.jsx            # Main app component with routing
```

## Authentication Flow

1. **Landing Page**: Users choose their role (User/Court)
2. **Signup/Login**: JWT authentication with role selection
3. **Role-based Routing**: Automatic redirection to appropriate dashboard
4. **Protected Routes**: Role-specific access control
5. **Session Management**: JWT tokens for backend communication

## Role-Based Access

### User (Citizen)
- File civil disputes
- Access AI-powered legal suggestions
- Schedule mediations
- View case history and documents
- Track case progress

### Court Official
- Review case submissions
- Schedule hearings and mediations
- Generate legal documents
- Manage court calendar
- Oversee case proceedings

## Backend Integration

The frontend communicates with the Node.js/Express backend:
- API Base URL: `http://localhost:5000/api`
- Authentication via Firebase tokens
- Role-specific endpoints (`/user/*` and `/court/*`)

## Development

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `App.jsx` with appropriate protection
3. Update navigation in `Navbar.jsx` if needed

### Styling
- Use Tailwind CSS classes
- Follow the established design system
- Ensure mobile responsiveness
- Use Framer Motion for animations

### State Management
- Use React Context for global state (AuthContext)
- Local state for component-specific data
- Backend API calls via axios

## Deployment

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to your preferred platform:**
   - Vercel (recommended)
   - Netlify
   - Firebase Hosting
   - AWS S3 + CloudFront

3. **Environment Variables:**
   - Update Firebase config for production
   - Set backend API URL
   - Configure CORS settings

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Test on mobile devices
6. Ensure accessibility standards

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Firebase** - Authentication and backend services
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client

## License

MIT License - see LICENSE file for details.
