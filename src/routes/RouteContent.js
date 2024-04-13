import { Router } from 'express';
import { content } from '../controllers/index';

import catchErrors from '../helpers/catchErrors';

const router = Router();

router.get('/', catchErrors(content.get));
router.post('/', catchErrors(content.create));
router.get('/:id/', catchErrors(content.getById));
router.put('/:id/', catchErrors(content.updateById));
router.delete('/:id/', catchErrors(content.deleteById));

export default router;
