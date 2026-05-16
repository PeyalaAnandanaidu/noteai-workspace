import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models/User.model';
import { env } from '../../config/env';

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

// Salt rounds: 12 is the sweet spot — secure but not too slow
const SALT_ROUNDS = 12;

function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

function formatUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export const authService = {
  async signup(input: SignupInput): Promise<AuthResult> {
    const { name, email, password } = input;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.name = 'ConflictError';
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    return {
      user: formatUser(user),
      token,
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    // Find user and explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Same error message for both "no user" and "wrong password"
      // This prevents user enumeration attacks
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id.toString());

    return {
      user: formatUser(user),
      token,
    };
  },

  async getMe(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return formatUser(user);
  },
};