import { body, validationResult } from 'express-validator/check';

import { User, Role } from '../models/index.js';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse';
import client from '../db/redis';

export default {
  validate: method => {
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

  getCurrentUser: async (req, res) => {
    const user = req.payload;
    if (!user) return Response.NotFoundUser(res);
    res.json({ user });
  },

  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

      const { email, password, firstName } = req.body;
      const find = await User.findOne({ email });
      if (find) return Response.BadRequest(res, 'user already exists');

      const role = await Role.findOne({ name: 'user' });
      const user = new User({ email, firstName, role: role.value, password: await User.encryptPassword(password) });
      await user.save();
      return Response.Create(res);
    } catch (error) {
      next(Response.InternalServerError(res, error.message));
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return Response.NotFoundUser(res);
      if (!(await user.isValidPassword(password))) return Response.InvalidUserOrPass(res);

      const accessToken = await jwt.signAccessToken(user.id);
      const refreshToken = await jwt.signRefreshToken(user.id);
      return Response.Ok(res, { accessToken, refreshToken });
    } catch (error) {
      next(Response.InternalServerError(res, error.message));
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return Response.BadRequest(res, {});
      const userId = await jwt.verifyRefreshToken(refreshToken);
      if (!userId) return Response.Unauthorized(res);

      const accessToken = await jwt.signAccessToken(userId);
      const refToken = await jwt.signRefreshToken(userId);
      Response.Ok(res, { accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(Response.InternalServerError(res, error.message));
    }
  },

  logout: async (req, res, next) => {
    try {
      const authHeader = req.headers?.['authorization'] || '';
      if (!authHeader) return Response.Unauthorized(res);
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      const userId = await jwt.verifyAccessToken(token);
      await client.DEL(userId);
      return Response.Ok(res);
    } catch (error) {
      next(Response.InternalServerError(res, error.message));
    }
  },
};
