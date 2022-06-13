import Response from '../helpers/helperResponse';
import { ROLES } from '../models/ModelRole';

export default {
  isAdmin: async (req, res, next) => {
    const user = req.payload;
    // console.log(user)
    if (!user) return Response.Unauthorized(res);
    if (!(user?.role === ROLES.admin)) return Response.Forbidden(res);
    next();
  },
  isModerator: async (req, res, next) => {
    const user = req.payload;
    if (!user) return Response.Unauthorized(res);
    if (!(user?.roles || []).map(i => i.value).includes('moderator')) return Response.Forbidden(res);
    next();
  },
};
