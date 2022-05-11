import client from '../db/redis';
import { Role } from '../models/index';
import Response from '../helpers/helperResponse';

const key = 'content';
const timeLife = 60 * 60 * 24;

export default {
  get: async (req, res) => {
    try {
      let roles = await client.get(key);
      if (!roles) {
        roles = await Role.find({}, '-_id').exec();
        await client.set(key, JSON.stringify(roles), { EX: timeLife });
      } else {
        roles = JSON.parse(roles);
      }
      res.json({ roles });
    } catch (error) {
      Response.InternalServerError(res);
    }
  },
};
