import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hash });
  await user.save();
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Account not found, please register');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Email or password is incorrect');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  return { user, token };
};

const getById = async (id) => User.findById(id).select('-password');

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Generate reset token (6-digit code or token)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set token expiry (1 hour)
  user.resetToken = hashedToken;
  user.resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // Return token untuk di-send ke email (atau di-display untuk testing)
  // Dalam production, kirim via email
  return { message: 'Reset token sent to email', resetToken };
};

const resetPassword = async ({ resetToken, newPassword }) => {
  if (!resetToken || !newPassword) {
    throw new Error('Reset token and new password required');
  }

  // Hash token to compare
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error('Invalid or expired reset token');

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetToken = null;
  user.resetTokenExpire = null;
  await user.save();

  return { message: 'Password reset successfully' };
};

export default { register, login, getById, forgotPassword, resetPassword };

