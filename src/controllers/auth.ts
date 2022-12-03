import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';
import { DataStoredInToken } from '../utils/interfaces/user.interface';
import { json } from 'stream/consumers';

// @desc    Fetch 12 products
// @route   GET /api/products
// @access  Public
export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const exist = await db.user.findUnique({
      where: { email },
    });

    if (exist) {
      res.status(400).json({ message: 'email already used!' });
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, salt),
      },
    });

    if (user) {
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const token = generateToken({
        id: user.id,
        key: '3033',
        time: '2h',
      });

      const refreshToken = generateToken({
        id: user.id,
        key: '3033r',
        time: '7d',
      });
      res.cookie('token', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https,
        sameSite: 'none', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });
      res.status(201).json({ user: userInfo, token });
    } else {
      res.status(400).json({ message: 'user not found!' });
    }
  }
);

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const token = generateToken({
        id: user.id,
        key: '3033',
        time: '2h',
      });

      const refreshToken = generateToken({
        id: user.id,
        key: '3033r',
        time: '7d',
      });
      res.cookie('token', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https,
        sameSite: 'none', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });
      res.status(201).json({ user: userInfo, token });
    } else {
      res.status(401).json({ message: 'wrong email or password' });
      return;
    }
  } else {
    res.status(404);
    throw new Error('user not found!');
  }
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.token) {
      res.status(401);
      throw new Error('Unauthorize');
    }

    const refreshT = cookies.token;

    const decoded = jwt.verify(refreshT, '3033r') as DataStoredInToken;

    const user = await db.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      res.status(404);
      throw new Error('user not found');
    }

    const accessToken = generateToken({
      id: user.id,
      key: '3033',
      time: '2h',
    });

    res.status(200).json({
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  }
);

export const userLogout = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.token) {
    throw res.status(204).json({ message: 'no cookies' });
  }

  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
  res.json({ message: 'Cookie cleared' });
});
