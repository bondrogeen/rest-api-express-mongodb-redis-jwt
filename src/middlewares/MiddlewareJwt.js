import { User } from '../models/index';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse';

export default {
  verifyAccessToken: async (req, res, next) => {
    const authHeader = req.headers?.['authorization'] || '';
    console.log(authHeader);
    if (!authHeader) return next(Response.Unauthorized(res));
    const bearerToken = authHeader.split(' ');
    console.log(bearerToken);
    const token = bearerToken[1];
    const id = await jwt.verifyAccessToken(token);
    console.log(id);
    if (id) {
      const user = await User.findOne({ _id: id }, '-password -createdAt -updatedAt').exec();
      console.log(user);
      if (!user) return Response.NotFoundUser(res);
      req.payload = user;
      return next();
    } else {
      return next(Response.Unauthorized(res));
    }
  },
};
