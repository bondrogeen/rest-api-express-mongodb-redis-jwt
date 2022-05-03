import { Router } from 'express';
import { jwt } from '../middlewares/';

import auth from './RouteAuth';
import user from './RouteUser';

const router = new Router();

router.use('/auth', auth);
router.use('/user', jwt.verifyAccessToken, user);

export default router;
