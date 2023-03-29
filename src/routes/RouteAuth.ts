import { Router } from 'express';
import { auth } from '../controllers/';
import { jwt } from '../middlewares';

const router = Router();

router.post('/register/', auth.validate('register'), auth.register);
router.get('/user/', [jwt.verifyAccessToken], auth.getCurrentUser);
router.post('/login/', auth.validate('login'), auth.login);
router.post('/refresh/', auth.refresh);
router.post('/logout/', auth.logout);

export default router;
