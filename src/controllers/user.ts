import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';
import { RequestWithUser } from '../utils/interfaces/user.interface';

export const getAllUsers = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const name: any = req.query.name || '';
    const users = await db.user.findMany({
      where: {
        username: { contains: name },
      },
      select: {
        id: true,
        email: true,
        username: true,
        Order: true,
        role: true,
        createdAt: true,
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

export const deleteUser = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await db.user.delete({
      where: {
        id: req.params.id,
      },
    });

    if (user) {
      res.status(200).json('user has been deleted');
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  }
);

export const updateUser = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await db.user.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  }
);

// export const updateUserProfile = asyncHandler(
//   async (req: RequestWithUser, res: Response) => {
//     const { username, email } = req.body;
//     const user = await db.user.update({
//       where: {
//         id: req.params.id,
//       },
//       data: {
//         username,
//         email,
//       },
//     });

//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: 'user not found' });
//     }
//   }
// );
