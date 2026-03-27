const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true
  },
  
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['admin', 'hr', 'manager', 'employee'], 
    default: 'employee' 
  },
  profilePic: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);