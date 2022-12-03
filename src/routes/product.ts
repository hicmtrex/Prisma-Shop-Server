import expess from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductList,
  updateProduct,
} from '../controllers/product';
import { admin, auth } from '../middleware/auth';

const router = expess.Router();

router.route('/').post(auth, admin, createProduct).get(getProductList);
router
  .route('/:id')
  .get(getProductById)
  .delete(auth, admin, deleteProduct)
  .put(auth, admin, updateProduct);

export default router;
