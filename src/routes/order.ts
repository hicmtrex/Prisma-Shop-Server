import expess from 'express';
import { auth } from '../../middleware/auth';

import {
  createOrder,
  getAllOrders,
  getOrderDetails,
} from '../controllers/order';

const router = expess.Router();

router.route('/').post(auth, createOrder).get(getAllOrders);
router.route('/:id').get(auth, getOrderDetails);

export default router;
