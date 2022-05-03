import { User } from '../models/index';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse';

export default {
  verifyAccessToken: async (req, res, next) => {
    const authHeader = req.headers?.['authorization'] || '';
    if (!authHeader) return next(Response.Unauthorized(res));
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const id = await jwt.verifyAccessToken(token);
    if (id) {
      const user = await User.findOne({ _id: id }, '-password -createdAt -updatedAt').populate('roles', '-_id').exec();
      if (!user) return Response.NotFoundUser(res);
      req.payload = user;
      return next();
    } else {
      return next(Response.Unauthorized(res));
    }
  },
};
