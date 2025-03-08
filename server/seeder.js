const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/Users');
const connectDB = require('./config/db');

dotenv.config();

const users = [
  {
    name: 'Admin_User1',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Teacher_User1',
    email: 'teacher@test.com',
    password: 'password123',
    role: 'teacher'
  },
  {
    name: 'Student_User1',
    email: 'student@test.com',
    password: 'password123',
    role: 'student'
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany();
    
    // Insert seed users
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    };
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();