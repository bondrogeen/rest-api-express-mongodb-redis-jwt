import { Request, Response, NextFunction } from 'express';

import { User } from '../models/index';
import { IUser } from '../models/ModelUser';
import jwt from '../helpers/helperJwt';
import HelpRespose from '../helpers/helperResponse';

declare global {
  namespace Express {
    interface Request {
      payload?: IUser;
    }
  }
}

export default {
  verifyAccessToken: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.['authorization'] || '';
    if (!authHeader) return next(HelpRespose.Unauthorized(res));
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const id = await jwt.verifyAccessToken(token);
    if (id) {
      const user = await User.findOne({ _id: id }, '-password -createdAt -updatedAt').exec();
      if (!user) return HelpRespose.NotFoundUser(res);
      req.payload = user;
      return next();
    } else {
      return next(HelpRespose.Unauthorized(res));
    }
  },
};
