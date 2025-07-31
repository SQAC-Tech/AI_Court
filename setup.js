#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AI-Court System Setup');
console.log('========================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

// Check if Node.js version is compatible
const checkNodeVersion = () => {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    log.error(`Node.js version ${nodeVersion} is not supported. Please install Node.js 16 or higher.`);
    process.exit(1);
  }
  
  log.success(`Node.js version ${nodeVersion} is compatible`);
};

// Check if npm is available
const checkNpm = () => {
  try {
    execSync('npm --version', { stdio: 'pipe' });
    log.success('npm is available');
  } catch (error) {
    log.error('npm is not available. Please install npm.');
    process.exit(1);
  }
};

// Check if MongoDB is running
const checkMongoDB = () => {
  try {
    execSync('mongod --version', { stdio: 'pipe' });
    log.success('MongoDB is installed');
    
    // Try to connect to MongoDB
    try {
      execSync('mongosh --eval "db.runCommand(\'ping\')"', { stdio: 'pipe' });
      log.success('MongoDB is running');
    } catch (error) {
      log.warning('MongoDB is installed but not running. Please start MongoDB before continuing.');
      log.info('To start MongoDB:');
      log.info('  - Windows: net start MongoDB');
      log.info('  - macOS: brew services start mongodb-community');
      log.info('  - Linux: sudo systemctl start mongod');
    }
  } catch (error) {
    log.warning('MongoDB is not installed or not in PATH');
    log.info('Please install MongoDB from https://www.mongodb.com/try/download/community');
  }
};

// Create environment files
const createEnvFiles = () => {
  log.step('Creating environment files...');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  
  // Backend .env
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-court

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production



# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
`;
    
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    log.success('Created backend/.env file');
  } else {
    log.info('backend/.env file already exists');
  }
  
  // Frontend .env
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `# Backend API URL
VITE_API_URL=http://localhost:5000/api


`;
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    log.success('Created frontend/.env file');
  } else {
    log.info('frontend/.env file already exists');
  }
};

// Install dependencies
const installDependencies = () => {
  log.step('Installing dependencies...');
  
  try {
    // Backend dependencies
    log.info('Installing backend dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
    log.success('Backend dependencies installed');
    
    // Frontend dependencies
    log.info('Installing frontend dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
    log.success('Frontend dependencies installed');
    
  } catch (error) {
    log.error('Failed to install dependencies');
    process.exit(1);
  }
};

// Setup demo data
const setupDemoData = () => {
  log.step('Setting up demo data...');
  
  try {
    execSync('node scripts/setup-demo.js', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
    log.success('Demo data setup completed');
  } catch (error) {
    log.warning('Failed to setup demo data. You can run it manually later with: cd backend && node scripts/setup-demo.js');
  }
};

// Display next steps
const displayNextSteps = () => {
  log.step('Setup completed! Next steps:');
  
  console.log(`
${colors.green}1. Configure Environment Variables:${colors.reset}
   - Edit backend/.env with your MongoDB connection and JWT secret
   - Edit frontend/.env with your backend API URL
   

${colors.green}2. Start the Application:${colors.reset}
   ${colors.cyan}Backend:${colors.reset} cd backend && npm run dev
   ${colors.cyan}Frontend:${colors.reset} cd frontend && npm run dev

${colors.green}3. Access the Application:${colors.reset}
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

${colors.green}4. Demo Accounts:${colors.reset}
   - User: user@example.com / Password123
   - Court: court@example.com / Password123
   - Admin: admin@example.com / Password123

${colors.yellow}⚠️  Important Security Notes:${colors.reset}
   - Change the JWT_SECRET in production
   - Update demo account passwords
   
   - Set up HTTPS in production

${colors.blue}📚 Documentation:${colors.reset}
   - See README.md for detailed setup instructions
   - Check troubleshooting section for common issues
`);
};

// Main setup function
const main = () => {
  try {
    checkNodeVersion();
    checkNpm();
    checkMongoDB();
    createEnvFiles();
    installDependencies();
    setupDemoData();
    displayNextSteps();
    
    log.success('Setup completed successfully! 🎉');
    
  } catch (error) {
    log.error('Setup failed: ' + error.message);
    process.exit(1);
  }
};

// Run setup
main(); 