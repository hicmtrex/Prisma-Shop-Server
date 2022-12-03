import expess from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderDetails,
  orderPayment,
  updateOrder,
} from '../controllers/order';
import { auth } from '../middleware/auth';

const router = expess.Router();

router.route('/').post(auth, createOrder).get(auth, getAllOrders);
router
  .route('/:id')
  .get(auth, getOrderDetails)
  .delete(auth, deleteOrder)
  .put(auth, updateOrder);

router.route('/stripe').post(orderPayment);

export default router;
