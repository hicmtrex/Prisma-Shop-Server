import expess from 'express';

import { getAllUsers, getUserDetails } from '../controllers/user';

const router = expess.Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getUserDetails);

export default router;
