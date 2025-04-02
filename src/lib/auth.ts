// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from "jsonwebtoken";
import User from '../../models/User';
import dbConnect from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'tulasai';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateUser = async (identifier: string, password: string) => {
  await dbConnect();
  const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return { token: generateToken(user._id), user };
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return typeof decoded === "object" ? (decoded as JwtPayload) : null;
  } catch (error) {
    return null;
  }
};
