const { sendMail } = require('./nodemailer.js');
const OTP = require('../models/Otp.js');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
const sendOTP = async (email) => {
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  await OTP.deleteMany({ email }); 
  await OTP.create({ email, otp: otpCode, expiresAt });

  await sendMail({
    to: email,
    subject: 'Your OTP Code',
    html: `<h3>Your OTP is: ${otpCode}</h3><p>It expires in 10 minutes.</p>`
  });
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email, otp });
  if (!record || record.expiresAt < Date.now()) {
    throw new Error('Invalid or expired OTP');
  }
  await OTP.deleteMany({ email });
  return true;
};

module.exports = { sendOTP, verifyOTP };
