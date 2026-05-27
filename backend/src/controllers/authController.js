const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const fileDb = require('../config/fileDb');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_spiritual_key_108', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const admin = fileDb.findOne('admins', { email });
      if (!admin) {
        res.status(401);
        throw new Error('Invalid credentials');
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
      }

      return res.json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    }

    // --- Standard MongoDB mode ---
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin (optional, for setup)
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const adminExists = fileDb.findOne('admins', { email });
      if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists with this email');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = fileDb.create('admins', {
        username,
        email,
        password: hashedPassword,
        role: 'Admin'
      });

      return res.status(201).json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    }

    // --- Standard MongoDB mode ---
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists with this email or username');
    }

    const admin = await Admin.create({
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  getMe,
  registerAdmin
};
