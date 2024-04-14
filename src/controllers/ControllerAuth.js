import { body, validationResult } from 'express-validator';

import { User, Role } from '../models/index.js';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse';
import { getErrors } from '../utils/general'
import client from '../db/redis';

export default {
	validate: {
		register: [
			body('email', 'errors.invalidEmail').exists().isEmail(),
			body('password', 'errors.doesntExists').exists().isLength({ min: 6 }).withMessage('errors.minLength6'),
			body('rePassword', 'errors.doesntExists').exists().custom((v, { req }) => v === req.body.password).withMessage('errors.doesntMatch'),
		],
		login: [body('email', 'errors.invalidEmail').exists().isEmail(), body('password', 'errors.doesntExists').exists()],
		recovery: [body('email', 'errors.invalidEmail').exists().isEmail()],
	},

	getCurrentUser: async (req, res) => {
		const user = req.payload;
		if (!user) return Response.NotFoundUser(res);
		res.json({ user });
	},

	register: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, getErrors(errors.array()));

		const { email, password } = req.body;
		const find = await User.findOne({ email });
		if (find) return Response.BadRequest(res, 'user already exists');

		const role = await Role.findOne({ name: 'user' });
		const user = new User({ email, role: role.value, password: await User.encryptPassword(password) });
		await user.save();
		return Response.Create(res);
	},

	recovery: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return Response.InvalidUserOrPass(res);
		// todo
		return Response.Ok(res, {});
	},

	login: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return Response.InvalidUserOrPass(res);
		if (!(await user.isValidPassword(password))) return Response.InvalidUserOrPass(res);

		const accessToken = await jwt.signAccessToken(user.id);
		const refreshToken = await jwt.signRefreshToken(user.id);
		return Response.Ok(res, { accessToken, refreshToken });
	},

	refresh: async (req, res) => {
		const { refreshToken } = req.body;
		if (!refreshToken) return Response.BadRequest(res, {});
		const userId = await jwt.verifyRefreshToken(refreshToken);
		if (!userId) return Response.Unauthorized(res);
		const accessToken = await jwt.signAccessToken(userId);
		const refToken = await jwt.signRefreshToken(userId);
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
