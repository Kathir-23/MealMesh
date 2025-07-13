import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, type: user.type },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};