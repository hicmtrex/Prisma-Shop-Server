import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';
import { RequestWithUser } from '../utils/interfaces/user.interface';

export const getAllUsers = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        Order: true,
        role: true,
      },
    });

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'users not found' });
    }
  }
);

export const getUserDetails = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await db.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        Order: true,
        role: true,
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  }
);
