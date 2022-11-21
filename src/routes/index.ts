import expess from 'express';
import authRoutes from './auth';
import productsRoutes from './product';
import orderRoutes from './order';
import userRoutes from './user';

const router = expess.Router();

router.use('/products', productsRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

export default router;
