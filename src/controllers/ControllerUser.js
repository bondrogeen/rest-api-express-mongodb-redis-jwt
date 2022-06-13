import { body, validationResult } from 'express-validator/check';

import { User, Role } from '../models/index';
import Response from '../helpers/helperResponse';
import mongo from '../helpers/helperMongoose';

export default {
  validate: method => {
    if (method === 'create') {
      return [
        body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists().isLength({ min: 6 }),
      ];
    }
    if (method === 'update') {
      return [
        body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
      ];
    }
  },

  create: async (req, res, next) => {
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

  get: async (req, res) => {
    try {
      const users = await User.find({}, '-password').exec();
      if (!users) return Response.NotFoundUser(res);
      res.json({ users });
    } catch (error) {
      Response.InternalServerError(res, error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId || !mongo.isValid(userId)) return Response.InvalidParams(res);
      const user = await User.findOne({ _id: userId }, '-password -createdAt -updatedAt').populate('roles', '-_id').exec();
      if (!user) return Response.NotFoundUser(res);
      res.json(user);
    } catch (error) {
      Response.InternalServerError(res, error.message);
    }
  },

  updateById: async (req, res) => {
    try {
      const { userId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

      const { firstName, lastName, phone, address } = req.body;
      if (!userId || !firstName || !mongo.isValid(userId)) return Response.InvalidParams(res);
      const result = await User.findOneAndUpdate({ _id: userId }, { firstName, lastName, phone, address });
      Response.Ok(res);
    } catch (error) {
      Response.InternalServerError(res, error.message);
    }
  },

  deleteById: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId || !mongo.isValid(userId)) return Response.InvalidParams(res);
      const result = await User.deleteOne({ _id: userId }).exec();
      Response.Ok(res);
    } catch (error) {
      Response.InternalServerError(res, error.message);
    }
  },
};
