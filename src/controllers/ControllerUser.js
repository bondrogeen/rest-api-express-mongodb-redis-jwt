import { User } from '../models/index';
import Response from '../helpers/helperResponse';
import mongo from '../helpers/helperMongoose';

export default {
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
      const { name } = req.body;
      if (!userId || !name || !mongo.isValid(userId)) return Response.InvalidParams(res);
      const result = await User.findOneAndUpdate({ _id: userId }, { name });
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
      Response.Ok(res, result);
    } catch (error) {
      Response.InternalServerError(res, error.message);
    }
  },
};
