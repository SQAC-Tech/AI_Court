const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = require('../config/database');

const demoUsers = [
  {
    email: 'user@example.com',
    password: 'Password123',
    displayName: 'Demo User',
    role: 'user',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    isActive: true
  },
  {
    email: 'court@example.com',
    password: 'Password123',
    displayName: 'Demo Court Official',
    role: 'court',
    phone: '+1234567891',
    address: '456 Court Ave, City, State 12345',
    court: 'District Court',
    designation: 'Judge',
    isActive: true
  },
  {
    email: 'admin@example.com',
    password: 'Password123',
    displayName: 'System Administrator',
    role: 'court',
    phone: '+1234567892',
    address: '789 Admin Blvd, City, State 12345',
    court: 'Supreme Court',
    designation: 'Administrator',
    isActive: true
  }
];

const setupDemoData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    
    console.log('🧹 Clearing existing demo users...');
    await User.deleteMany({ 
      email: { $in: demoUsers.map(user => user.email) } 
    });
    
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    
    for (const userData of demoUsers) {
      try {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Demo setup completed!');
    console.log(`📊 Created ${createdUsers.length} demo users`);
    
    console.log('\n🔑 Demo Account Credentials:');
    console.log('=====================================');
    createdUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: Password123`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });
    
    console.log('\n⚠️  IMPORTANT: Change these passwords in production!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDemoData();
}

module.exports = setupDemoData; 