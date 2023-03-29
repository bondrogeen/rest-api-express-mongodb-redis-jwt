import { Router } from 'express';
import { content } from '../controllers/index';

const router = Router();

router.get('/', content.get);

export default router;
