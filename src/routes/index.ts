import { Router } from 'express';
import { jwt } from '../middlewares';

import auth from './RouteAuth';
import user from './RouteUser';
import content from './RouteContent';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/content', content);

export default router;
