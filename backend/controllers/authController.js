const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('../utils/otp');

// Register with OTP verification
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await sendOTP(email);
    
    req.session = { tempUser: { name, email, password: hashedPassword } }; // Store in session/temp (or frontend)
    res.status(200).json({ message: 'OTP sent. Please verify to complete registration.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete Registration with OTP
exports.verifyRegisterOtp = async (req, res) => {
  const { name, email, password, otp } = req.body;
  try {
    const isValid = await verifyOTP(email, otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, isVerified: true });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ message: 'Invalid or unverified account' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendOTP(email);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const isValid = await verifyOTP(email, otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.registerUser = async (req, res) => {
  const { name, email, password, adminCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check admin code from env variable
    const role = adminCode === process.env.ADMIN_SECRET ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true,
      isActive: true,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
