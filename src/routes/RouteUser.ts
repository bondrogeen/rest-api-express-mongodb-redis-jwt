import { Router } from 'express';
import { role } from '../middlewares';
import { user } from '../controllers/index';

const router = Router();

router.get('/', user.get);
router.post('/', [user.validate('create')], user.create);
router.get('/:userId/', [role.isAdmin], user.getById);
router.put('/:userId/', [role.isAdmin, user.validate('update')], user.updateById);
router.delete('/:userId/', [role.isAdmin], user.deleteById);

export default router;
