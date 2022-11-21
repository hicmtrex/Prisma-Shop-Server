import expess from 'express';
import { auth } from '../../middleware/auth';
import {
  createProduct,
  getProductById,
  getProductList,
} from '../controllers/product';

const router = expess.Router();

router.route('/').post(auth, createProduct).get(getProductList);
router.route('/:id').get(getProductById);

export default router;
