import { Router } from 'express';
import { auth } from '../controllers/index';
import { jwt } from '../middlewares';

import helperErrors from '../helpers/helperErrors';

const router = Router();

router.post('/register/', auth.validate.register, helperErrors(auth.register));
router.get('/user/', [jwt.verifyAccessToken], helperErrors(auth.getCurrentUser));
router.post('/login/', auth.validate.login, helperErrors(auth.login));
router.post('/refresh/', helperErrors(auth.refresh));
router.post('/logout/', helperErrors(auth.logout));

export default router;
