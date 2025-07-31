const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Document = require('../models/Document');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-court', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDemoUsers = async () => {
  try {
    // Check if demo users already exist
    const existingUser = await User.findOne({ email: 'user@example.com' });
    if (existingUser) {
      console.log('✅ Demo users already exist');
      return;
    }

    // Create demo user
    const userPassword = await bcrypt.hash('password123', 12);
    const demoUser = new User({
      email: 'user@example.com',
      password: userPassword,
      displayName: 'John Doe',
      role: 'user',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra',
      isActive: true
    });
    await demoUser.save();

    // Create demo court user
    const courtPassword = await bcrypt.hash('password123', 12);
    const demoCourt = new User({
      email: 'court@example.com',
      password: courtPassword,
      displayName: 'Hon. Judge Smith',
      role: 'court',
      phone: '+91 9876543211',
      address: 'Mumbai, Maharashtra',
      court: 'Mumbai High Court',
      designation: 'Senior Judge',
      isActive: true
    });
    await demoCourt.save();

    console.log('✅ Demo users created successfully');
    console.log('👤 User Account: user@example.com / password123');
    console.log('⚖️  Court Account: court@example.com / password123');
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  }
};

const createDemoDocuments = async () => {
  try {
    // Check if demo documents already exist
    const existingDocs = await Document.countDocuments();
    if (existingDocs > 0) {
      console.log('✅ Demo documents already exist');
      return;
    }

    const user = await User.findOne({ email: 'user@example.com' });
    const court = await User.findOne({ email: 'court@example.com' });

    if (!user || !court) {
      console.log('❌ Demo users not found. Please run setup again.');
      return;
    }

    // Create demo documents
    const demoDocuments = [
      {
        filename: `${Date.now()}-settlement-agreement.pdf`,
        originalName: 'Settlement Agreement.pdf',
        fileType: 'pdf',
        fileSize: 2457600, // 2.4MB
        fileContent: 'JVBERi0xLjQKJcOkw7zDtsO...', // Base64 placeholder
        uploadedBy: {
          userId: user._id,
          email: user.email,
          displayName: user.displayName
        },
        description: 'Comprehensive settlement agreement between parties in the property dispute case.',
        tags: ['legal', 'settlement', 'agreement'],
        status: 'pending',
        aiAnalysis: 'This document appears to be a standard settlement agreement with typical clauses for dispute resolution. The language is clear and legally sound.',
        isSigned: false
      },
      {
        filename: `${Date.now()}-legal-notice.pdf`,
        originalName: 'Legal Notice.pdf',
        fileType: 'pdf',
        fileSize: 1843200, // 1.8MB
        fileContent: 'JVBERi0xLjQKJcOkw7zDtsO...', // Base64 placeholder
        uploadedBy: {
          userId: user._id,
          email: user.email,
          displayName: user.displayName
        },
        description: 'Formal legal notice to be served to the opposing party.',
        tags: ['legal', 'notice', 'formal'],
        status: 'reviewed',
        aiAnalysis: 'This legal notice follows standard format and contains appropriate legal language. All required elements are present.',
        isSigned: false
      },
      {
        filename: `${Date.now()}-affidavit.pdf`,
        originalName: 'Affidavit of Evidence.pdf',
        fileType: 'pdf',
        fileSize: 3145728, // 3.1MB
        fileContent: 'JVBERi0xLjQKJcOkw7zDtsO...', // Base64 placeholder
        uploadedBy: {
          userId: user._id,
          email: user.email,
          displayName: user.displayName
        },
        description: 'Sworn statement of facts and evidence in support of the case.',
        tags: ['legal', 'affidavit', 'evidence'],
        status: 'approved',
        aiAnalysis: 'This affidavit is well-structured with clear statements of facts. The evidence presented is relevant and properly documented.',
        isSigned: true,
        signedBy: {
          courtId: court._id,
          courtEmail: court.email,
          courtName: court.displayName,
          signedAt: new Date()
        }
      }
    ];

    for (const doc of demoDocuments) {
      const document = new Document(doc);
      await document.save();
    }

    console.log('✅ Demo documents created successfully');
  } catch (error) {
    console.error('❌ Error creating demo documents:', error);
  }
};

const setupDemo = async () => {
  try {
    console.log('🚀 Setting up demo data...');
    
    await connectDB();
    await createDemoUsers();
    await createDemoDocuments();
    
    console.log('✅ Demo setup completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('👤 User: user@example.com / password123');
    console.log('⚖️  Court: court@example.com / password123');
    console.log('\n🔗 Start the backend server with: npm run dev');
    console.log('🔗 Start the frontend with: cd ../frontend && npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

setupDemo(); 