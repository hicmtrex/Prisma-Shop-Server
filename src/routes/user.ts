import expess from 'express';

import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  updateUser,
} from '../controllers/user';
import { admin, auth } from '../middleware/auth';

const router = expess.Router();

router.route('/').get(auth, admin, getAllUsers);
router
  .route('/:id')
  .get(getUserDetails)
  .put(auth, updateUser)
  .delete(auth, admin, deleteUser);

export default router;
