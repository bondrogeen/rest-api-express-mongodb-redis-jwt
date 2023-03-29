import { Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator/check';

import { User, Role } from '../models/';
import jwt from '../helpers/helperJwt';
import HelpResponse from '../helpers/helperResponse';
import client from '../db/redis';

export default {
  validate: (method: string) => {
    if (method === 'register') {
      return [
        body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists().isLength({ min: 6 }),
      ];
    } else if (method === 'login') {
      return [body('email', 'Invalid email').exists().isEmail(), body('password').exists()];
    } else {
      return [];
    }
  },

  getCurrentUser: async (req: Request, res: Response) => {
    const user = req.payload;
    if (!user) return HelpResponse.NotFoundUser(res);
    res.json({ user });
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return HelpResponse.BadRequest(res, { errors: errors.array() });

      const { email, password, firstName } = req.body;
      const find = await User.findOne({ email });
      if (find) return HelpResponse.BadRequest(res, 'user already exists');

      const role = await Role.findOne({ name: 'user' });
      const user = new User({ email, firstName, role: role.value, password: await User.encryptPassword(password) });
      await user.save();
      return HelpResponse.Create(res);
    } catch (error) {
      next(HelpResponse.InternalServerError(res));
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return HelpResponse.BadRequest(res, { errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return HelpResponse.NotFoundUser(res);
      if (!(await user.isValidPassword(password))) return HelpResponse.InvalidUserOrPass(res);

      const accessToken = await jwt.signAccessToken(user.id);
      const refreshToken = await jwt.signRefreshToken(user.id);
      return HelpResponse.Ok(res, { accessToken, refreshToken });
    } catch (error) {
      next(HelpResponse.InternalServerError(res));
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return HelpResponse.BadRequest(res, {});
      const userId = await jwt.verifyRefreshToken(refreshToken);
      if (!userId) return HelpResponse.Unauthorized(res);

      const accessToken = await jwt.signAccessToken(userId);
      const refToken = await jwt.signRefreshToken(userId);
      HelpResponse.Ok(res, { accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(HelpResponse.InternalServerError(res));
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers?.['authorization'] || '';
      if (!authHeader) return HelpResponse.Unauthorized(res);
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      const userId = await jwt.verifyAccessToken(token);
      await client.DEL(userId);
      return HelpResponse.Ok(res);
    } catch (error) {
      next(HelpResponse.InternalServerError(res));
    }
  },
};
