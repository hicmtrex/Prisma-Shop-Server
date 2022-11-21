import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { DataStoredInToken } from '../src/utils/interfaces/user.interface';
import jwt from 'jsonwebtoken';
import db from '../src/lib/prisma';

export const auth = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1];

      const decoded = jwt.verify(token, '3033') as DataStoredInToken;

      const user = await db.user.findUnique({ where: { id: decoded.id } });

      if (user) {
        req.user = user;
        next();
      } else {
        throw res.status(401).json({ message: 'no user has found!' });
      }
    } else {
      throw res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
);
