import { Request, Response, NextFunction } from 'express';

import HelpResponse from '../helpers/helperResponse';
import { ROLES } from '../models/ModelRole';

import { IUser } from '../models/ModelUser';

declare global {
  namespace Express {
    interface Request {
      payload?: IUser;
    }
  }
}

export default {
  isAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.payload;
    // console.log(user)
    if (!user) return HelpResponse.Unauthorized(res);
    if (!(user?.role === ROLES.admin)) return HelpResponse.Forbidden(res);
    next();
  },
  isModerator: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.payload;
    if (!user) return HelpResponse.Unauthorized(res);
    if (!(user?.role === ROLES.moderator)) return HelpResponse.Forbidden(res);
    next();
  },
};
