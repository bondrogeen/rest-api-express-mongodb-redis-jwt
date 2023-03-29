import dotenv from 'dotenv';
const { config } = dotenv;
config();

export interface ISettings {
  server: IServer;
  mongodb: IMongodb;
  token: IToken;
  redis: IRedis;
}

export interface IServer {
  host: string;
  port: string | number;
  prefix: string;
}
export interface IMongodb {
  url: string;
  dbName: string;
  options: object;
}
export interface IToken {
  access: ITokenOptions;
  refresh: ITokenOptions;
}
export interface ITokenOptions {
  secret: string;
  expiresIn: number;
}
export interface IRedis {
  url: string;
}

const settings: ISettings = {
  server: {
    host: process.env.HOST || '',
    port: process.env.PORT || 3001,
    prefix: '/api/v1',
  },
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://user:password@localhost:27017',
    dbName: process.env.DB_NAME || 'test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  token: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET || 'access-secret',
      expiresIn: +(process.env.ACCESS_TOKEN_LIFE || 60 * 5),
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET || 'access-secret',
      expiresIn: +(process.env.REFRESH_TOKEN_LIFE || 60 * 60 * 24 * 30),
    },
  },
  redis: {
    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`,
  },
};

export default settings;
