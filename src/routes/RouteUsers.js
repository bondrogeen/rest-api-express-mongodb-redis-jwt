import { Router } from 'express';
import { role } from '../middlewares';
import { user } from '../controllers/index';

import catchErrors from '../helpers/catchErrors';

const router = Router();

router.get('/', catchErrors(user.get));
router.post('/', [role.isAdmin, user.validate.create], catchErrors(user.create));
router.get('/:id/', [role.isAdmin], catchErrors(user.getById));
router.put('/:id/', [role.isAdmin, user.validate.update], catchErrors(user.updateById));
router.delete('/:id/', [role.isAdmin], catchErrors(user.deleteById));

export default router;
