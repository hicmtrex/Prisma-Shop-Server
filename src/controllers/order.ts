import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';
import { RequestWithUser } from '../utils/interfaces/user.interface';
import Stripe from 'stripe';
import UIDGenerator from 'uid-generator';

export const createOrder = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { cartItems, totalPrice, shippingAddress } = req.body;

    const order = await db.order.create({
      data: {
        cartItems,
        shippingAddress,
        totalPrice,
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
export const deleteOrder = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const order = await db.order.delete({
      where: { id: req.params.id },
      select: {
        id: true,
        shippingAddress: true,
        cartItems: true,
        totalPrice: true,
        user: true,
        isPaid: true,
        createdAt: true,
      },
    });

    if (order) {
      res.status(200).json({ message: 'order has been cancled' });
    } else {
      res.status(404).json({ message: 'something went wrong!' });
    }
  }
);
export const getAllOrders = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const orders = await db.order.findMany({
      select: {
        id: true,
        shippingAddress: true,
        cartItems: true,
        totalPrice: true,
        user: true,
        isPaid: true,
        createdAt: true,
      },
    });

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

export const updateOrder = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const order = await db.order.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  }
);

//payment
const key: string | undefined = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(key, {
  apiVersion: '2022-11-15',
});

const uidgen = new UIDGenerator();

export const orderPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, amount } = req.body;
    const idempotencyKey = await uidgen.generate();
    return stripe.customers
      .create({
        email: token?.email,
        source: token,
      })
      .then((customer) => {
        stripe.charges.create(
          {
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token?.email,
          },
          { idempotencyKey }
        );
      })
      .then((result) => {
        res.status(200).json(result);
      });
  }
);
