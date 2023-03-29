import { Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator/check';

import { User, Role } from '../models/';
import HelpRes from '../helpers/helperResponse';
import mongo from '../helpers/helperMongoose';

export default {
  validate: (method: string): any => {
    if (method === 'create') {
      return [
        body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists().isLength({ min: 6 }),
      ];
    }
    if (method === 'update') {
      return [body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char')];
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return HelpRes.BadRequest(res, { errors: errors.array() });

      const { email, password, firstName } = req.body;
      const find = await User.findOne({ email });
      if (find) return HelpRes.BadRequest(res, 'user already exists');

      const role = await Role.findOne({ name: 'user' });

      const encryptPassword = await User.encryptPassword(password);
      const user = new User({ email, firstName, role: role.value, password: encryptPassword });

      await user.save();
      return HelpRes.Create(res);
    } catch (error) {
      next(HelpRes.InternalServerError(res));
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      const users = await User.find({}, '-password').exec();
      if (!users) return HelpRes.NotFoundUser(res);
      res.json({ users });
    } catch (error) {
      HelpRes.InternalServerError(res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId || !mongo.isValid(userId)) return HelpRes.InvalidParams(res);
      const user = await User.findOne({ _id: userId }, '-password -createdAt -updatedAt').populate('roles', '-_id').exec();
      if (!user) return HelpRes.NotFoundUser(res);
      res.json(user);
    } catch (error) {
      HelpRes.InternalServerError(res);
    }
  },

  updateById: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) return HelpRes.BadRequest(res, { errors: errors.array() });

      const { firstName, lastName, phone, address } = req.body;
      if (!userId || !firstName || !mongo.isValid(userId)) return HelpRes.InvalidParams(res);
      const result = await User.findOneAndUpdate({ _id: userId }, { firstName, lastName, phone, address });
      HelpRes.Ok(res);
    } catch (error) {
      HelpRes.InternalServerError(res);
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId || !mongo.isValid(userId)) return HelpRes.InvalidParams(res);
      const result = await User.deleteOne({ _id: userId }).exec();
      HelpRes.Ok(res);
    } catch (error) {
      HelpRes.InternalServerError(res);
    }
  },
};
