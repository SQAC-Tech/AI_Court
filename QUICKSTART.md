# 🚀 Quick Start Guide

Get the AI-Court system up and running in minutes!

## Prerequisites

- Node.js 16+ 
- MongoDB (local or cloud)
- npm or yarn

## ⚡ Quick Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd AI_Court
node setup.js
```

This will:
- ✅ Check your system requirements
- ✅ Create environment files
- ✅ Install all dependencies
- ✅ Setup demo data

### 2. Configure Environment (Optional)

Edit the generated `.env` files if needed:

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/ai-court
JWT_SECRET=your-super-secret-jwt-key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:5000

## 👥 Demo Accounts

After setup, you can login with:

| Email | Password | Role |
|-------|----------|------|
| user@example.com | Password123 | User |
| court@example.com | Password123 | Court Official |
| admin@example.com | Password123 | Administrator |

## 🔧 Manual Setup (if auto-setup fails)

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
node scripts/setup-demo.js
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

## 🚨 Common Issues

### MongoDB Connection Failed
```bash
# Start MongoDB
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
Change ports in `.env` files:
```env
# Backend
PORT=5001

# Frontend (in vite.config.js)
server: { port: 5174 }
```

### Firebase Issues
Firebase is optional. The system works without it. If you want to use Firebase:

1. Create a Firebase project
2. Download service account key
3. Update environment variables

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check the [troubleshooting section](README.md#troubleshooting) for common issues
- Explore the API endpoints in the [API documentation](README.md#api-documentation)

## 🆘 Need Help?

1. Check the [troubleshooting section](README.md#troubleshooting)
2. Review the logs for error details
3. Create an issue with detailed error information

---

**Happy coding! 🎉** 