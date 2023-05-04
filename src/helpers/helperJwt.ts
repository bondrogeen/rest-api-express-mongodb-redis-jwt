import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import client from '../db/redis';

export default {
  signAccessToken: (payload: object): string => {
    return jwt.sign(payload, config.token.access.secret, { expiresIn: config.token.access.expiresIn });
  },
  signRefreshToken: (payload: object): string => {
    return jwt.sign(payload, config.token.refresh.secret, { expiresIn: config.token.refresh.expiresIn });
  },

  verifyAccessToken: (token: string): string | JwtPayload => {
    try {
      const result = jwt.verify(token, config.token.access.secret);
      return result;
    } catch (error) {
      return '';
    }
  },

  verifyRefreshToken: (refreshToken: string): string | JwtPayload => {
    try {
      return jwt.verify(refreshToken, config.token.refresh.secret);
    } catch (error) {
      return '';
    }
  },
};
