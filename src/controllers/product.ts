import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';

export const getProductList = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await db.product.findMany({});

    if (products) {
      res.status(200).json(products);
    } else {
      res.status(400);
      throw new Error('products not found');
    }
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await db.product.findUnique({
      where: { id: req.params.id },
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({ message: 'product not found' });
    }
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await db.product.create({
      data: req.body,
    });

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400);
      throw new Error('product not found');
    }
  }
);
