import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../lib/prisma';

export const filterProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await db.product.findMany({
      where: {
        name: { equals: '' },
      },
    });

    if (products) {
      res.status(200).json(products);
    } else {
      res.status(400);
      throw new Error('products not found');
    }
  }
);

export const getProductList = asyncHandler(
  async (req: Request, res: Response) => {
    const name: any = req.query.name || '';
    const category: any = req.query.category || '';
    const brand: any = req.query.brand || '';

    const allProducts = await db.product.findMany({});

    const products = await db.product.findMany({
      where: {
        name: { contains: name },
        OR: [
          {
            category: { contains: category },
            brand: { contains: brand },
          },
        ],
      },
    });

    if (products) {
      let categories: string[] = [];
      let brands: string[] = [];

      allProducts.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }

        if (!brands.includes(product.brand)) {
          brands.push(product.brand);
        }
      });

      res.status(200).json({ products, brands, categories });
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
      res
        .status(500)
        .json({ message: 'something went wrong please try again' });
    }
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await db.product.delete({
      where: {
        id: req.params.id,
      },
    });

    if (product) {
      res.status(200).json({ message: 'product has been deleted' });
    } else {
      res.status(404).json({ message: 'product not found' });
    }
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await db.product.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    if (product) {
      res.status(200).json({ message: 'product has been deleted' });
    } else {
      res.status(400);
      throw new Error('product not found');
    }
  }
);
