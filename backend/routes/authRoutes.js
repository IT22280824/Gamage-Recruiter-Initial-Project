const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
require('../middlewares/passport.js');

router.post('/register', authController.registerUser);
router.post('/verify-registration', authController.verifyRegisterOtp);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//     session: false,
//   }),
//   (req, res) => {
//     // Send JWT after successful login
//     const token = jwt.sign({ userId: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
//   }
// );

const CLIENT_URL = process.env.CLIENT_URL;

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token in URL
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}`);
  }
);


module.exports = router;
