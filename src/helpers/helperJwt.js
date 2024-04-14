import jwt from 'jsonwebtoken';
import config from '../config';
import client from '../db/redis';

export default {
  signAccessToken: async userId => {
    return jwt.sign({ id: userId }, config.token.access.secret, { expiresIn: config.token.access.expiresIn });
  },

  signRefreshToken: async userId => {
    const token = jwt.sign({ id: userId }, config.token.refresh.secret, { expiresIn: config.token.refresh.expiresIn });
    await client.SET(userId, token, { EX: config.token.refresh.expiresIn });
    return token;
  },

  verifyAccessToken: async token => {
    try {
      const user = await jwt.verify(token, config.token.access.secret);
      return user?.id
    } catch (error) {
      return
    }
  },

  verifyRefreshToken: async refreshToken => {
    try {
      const user = await jwt.verify(refreshToken, config.token.refresh.secret);
      if (!user) return false;
      const result = await client.GET(user.id);
      return refreshToken === result ? user?.id : false;
    } catch (error) {
      return
    }
  },
};
