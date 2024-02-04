import dotenv from 'dotenv';
const { config } = dotenv;
config();

export default {
	server: {
		host: process.env.HOST || '',
		port: process.env.PORT || 3001,
		prefix: '/api/v1',
	},
	mongodb: {
		url: process.env.MONGODB_URI || 'mongodb://user:password@localhost:27017',
		dbName: process.env.DB_NAME || 'test',
		options: {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useFindAndModify: false,
			// useCreateIndex: true,
		},
	},
	token: {
		access: {
			secret: process.env.ACCESS_TOKEN_SECRET || 'access-secret',
			expiresIn: +process.env.ACCESS_TOKEN_LIFE || 60 * 5,
		},
		refresh: {
			secret: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
			expiresIn: +process.env.REFRESH_TOKEN_LIFE || 60 * 60 * 24 * 30,
		},
	},
	redis: {
		url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`,
	},
};
