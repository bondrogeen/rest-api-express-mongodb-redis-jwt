import { Router } from 'express';
import { role } from '../middlewares';
import { user } from '../controllers/index';

const router = Router();

router.get('/', user.get);
router.post('/', [role.isAdmin, user.validate.create], user.create);
router.get('/:id/', [role.isAdmin], user.getById);
router.put('/:id/', [role.isAdmin, user.validate.update], user.updateById);
router.delete('/:id/', [role.isAdmin], user.deleteById);

export default router;
