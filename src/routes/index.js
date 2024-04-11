import { Router } from 'express';
import { jwt } from '../middlewares/';

import auth from './RouteAuth';
import user from './RouteUsers';
import content from './RouteContent';

const router = new Router();

router.use('/auth', auth);
router.use('/users', jwt.verifyAccessToken, user);
router.use('/content', content);

export default router;
