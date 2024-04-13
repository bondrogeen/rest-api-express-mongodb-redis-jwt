import { Router } from 'express';
import { auth } from '../controllers/index';
import { jwt } from '../middlewares';

import catchErrors from '../helpers/catchErrors';

const router = Router();

router.post('/register/', auth.validate.register, catchErrors(auth.register));
router.get('/user/', [jwt.verifyAccessToken], catchErrors(auth.getCurrentUser));
router.post('/login/', auth.validate.login, catchErrors(auth.login));
router.post('/refresh/', catchErrors(auth.refresh));
router.post('/logout/', catchErrors(auth.logout));

export default router;
