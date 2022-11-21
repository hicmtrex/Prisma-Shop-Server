import expess from 'express';
import {
  refreshToken,
  userLogin,
  userLogout,
  userRegister,
} from '../controllers/auth';

const router = expess.Router();

router.route('/').post(userRegister).get(refreshToken);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);

export default router;
