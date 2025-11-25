import express from 'express';
import { body } from 'express-validator';
import { login, register, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], login);

export default router;

// Forgot/Reset password
router.post('/forgot-password', [
  body('email').isEmail()
], forgotPassword);

router.post('/reset-password', [
  body('password').isLength({ min: 6 }),
  body().custom((value, { req }) => {
    const { token, email, otp } = req.body || {};
    if (token || (email && otp)) return true;
    throw new Error('Provide token or email+otp');
  })
], resetPassword);
