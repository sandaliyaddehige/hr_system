const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 0. Ensure Directory Exists ---
const uploadDir = 'uploads/profiles/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- Multer Config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images Only!'));
  }
});

// --- 1. REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = (role && role.toLowerCase()) || 'employee';

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      name: name,
      username: name,
     email: email,
      password: hashedPassword,
      role: userRole,
      profileImage: ""
    });

    const savedUser = await newUser.save();

    // Create Employee Record (If role is employee)
    if (userRole === 'employee') {
      try {
        const newEmployee = new Employee({
          userId: savedUser._id,
          name: savedUser.name, 
          email: savedUser.email,
          role: 'employee',
          status: 'Active',
          joinDate: new Date(),
          
          phone: "Not Provided", 
          dept: "General" 
        });
        await newEmployee.save();
      } catch (empErr) {
        console.error("Employee Profile Creation Failed:", empErr);
        
      }
    }

    res.status(201).json({ success: true, message: "Registration Successful!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server Error during registration" });
  }
});

// --- 2. LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role.toLowerCase(),
        profileImage: user.profileImage || ""
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- 3. GET PROFILE ---
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Profile fetch error" });
  }
});

// --- 4. UPLOAD AVATAR ---
router.post('/upload-avatar/:id', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please upload a file" });
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    await User.findByIdAndUpdate(req.params.id, { profileImage: imageUrl });
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;