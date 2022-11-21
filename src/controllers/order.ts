import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';
import { RequestWithUser } from '../utils/interfaces/user.interface';

export const createOrder = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { cartItems, totalPrice } = req.body;

    const order = await db.order.create({
      data: {
        cartItems,
        totalPrice: totalPrice,
        userId: req.user?.id,
      },
    });

    if (order) {
      res.status(201).json(order);
    } else {
      res
        .status(500)
        .json({ message: 'something went wrong please try again' });
    }
  }
);

export const getAllOrders = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const orders = await db.order.findMany({});

    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: 'orders not found' });
    }
  }
);

export const getOrderDetails = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const order = await db.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  }
);
