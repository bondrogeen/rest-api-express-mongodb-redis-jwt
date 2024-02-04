import { Router } from 'express';
import { content } from '../controllers/index';

const router = Router();

router.get('/', content.get);
router.post('/', content.create);
router.get('/:id/', content.getById);
router.put('/:id/', content.updateById);
router.delete('/:id/', content.deleteById);

export default router;
