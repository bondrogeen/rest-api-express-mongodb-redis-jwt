import jwt from 'jsonwebtoken';
import config from '../config';
import client from '../db/redis';

export default {
  signAccessToken: async (userId: string): Promise<string> => {
    return await jwt.sign({ id: userId }, config.token.access.secret, { expiresIn: config.token.access.expiresIn });
  },

  signRefreshToken: async (userId: string): Promise<string> => {
    const token = await jwt.sign({ id: userId }, config.token.refresh.secret, { expiresIn: config.token.refresh.expiresIn });
    await client.SET(userId, token, { EX: config.token.refresh.expiresIn });
    return token;
  },

  verifyAccessToken: async (token: string): Promise<string> => {
    const user = await jwt.verify(token, config.token.access.secret);
    // return user ? user.id : '';
    return '';
  },

  verifyRefreshToken: async (refreshToken: string): Promise<string> => {
    const user = await jwt.verify(refreshToken, config.token.refresh.secret);
    // if (!user) return false;
    // const result = await client.GET(user.id);
    // return refreshToken === result ? user.id : false;
    return '';
  },
};
