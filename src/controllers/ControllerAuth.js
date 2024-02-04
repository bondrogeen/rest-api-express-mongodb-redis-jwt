import { body, validationResult } from 'express-validator';

import { User, Role } from '../models/index.js';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse';
import client from '../db/redis';

export default {
	validate: {
		register: [
			body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
			body('email', 'Invalid email').exists().isEmail(),
			body('password').exists().isLength({ min: 6 }),
		],
		login: [body('email', 'Invalid email').exists().isEmail(), body('password').exists()],
	},

	getCurrentUser: async (req, res) => {
		const user = req.payload;
		if (!user) return Response.NotFoundUser(res);
		res.json({ user });
	},

	register: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { email, password, firstName } = req.body;
		const find = await User.findOne({ email });
		if (find) return Response.BadRequest(res, 'user already exists');

		const role = await Role.findOne({ name: 'user' });
		const user = new User({ email, firstName, role: role.value, password: await User.encryptPassword(password) });
		await user.save();
		return Response.Create(res);
	},

	login: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return Response.NotFoundUser(res);
		if (!(await user.isValidPassword(password))) return Response.InvalidUserOrPass(res);

		const accessToken = await jwt.signAccessToken(user.id);
		const refreshToken = await jwt.signRefreshToken(user.id);
		return Response.Ok(res, { accessToken, refreshToken });
	},

	refresh: async (req, res) => {
		console.log('refresh');
		const { refreshToken } = req.body;
		console.log('refreshToken', refreshToken);
		if (!refreshToken) return Response.BadRequest(res, {});
		const userId = await jwt.verifyRefreshToken(refreshToken);
		console.log('userId', userId);
		if (!userId) return Response.Unauthorized(res);
		
		const accessToken = await jwt.signAccessToken(userId);
		const refToken = await jwt.signRefreshToken(userId);
		console.log('accessToken', accessToken);
		console.log('refToken', refToken);
		Response.Ok(res, { accessToken: accessToken, refreshToken: refToken });
	},

	logout: async (req, res) => {
		const authHeader = req.headers?.['authorization'] || '';
		if (!authHeader) return Response.Unauthorized(res);
		const bearerToken = authHeader.split(' ');
		const token = bearerToken[1];
		const userId = await jwt.verifyAccessToken(token);
		await client.DEL(userId);
		return Response.Ok(res);
	},
};
