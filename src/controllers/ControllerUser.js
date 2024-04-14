import { body, validationResult } from 'express-validator';

import { User, Role } from '../models/index';

import Response from '../helpers/helperResponse';
import { isValid, parseQuery } from '../helpers/helperMongoose';
import { getErrors } from '../utils/general'

export default {
	validate: {
		create: [
			body('email', 'errors.invalidEmail').exists().isEmail(),
			body('password', 'errors.doesntExists').exists().isLength({ min: 6 }).withMessage('errors.minLength6'),
			body('rePassword', 'errors.doesntExists').exists().custom((v, { req }) => v === req.body.password).withMessage('errors.doesntMatch'),
		],
		update: [body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char')],
	},

	create: async (req, res, next) => {
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

	get: async (req, res) => {
		const { skip, page, limit, sort } = parseQuery(req.query);
		const users = await User.find({}, '-password').limit(limit).skip(skip).sort(sort).exec();
		const count = await User.countDocuments();
		if (!users) return Response.NotFound(res);
		res.json({ items: users, meta: { total: Math.ceil(count / limit), current: +page, } });
	},

	getById: async (req, res) => {
		const { id } = req.params;
		if (!id || !isValid(id)) return Response.InvalidParams(res);
		const user = await User.findOne({ _id: id }, '-password -createdAt -updatedAt').exec();
		if (!user) return Response.NotFoundUser(res);
		res.json(user);
	},

	updateById: async (req, res) => {
		const { id } = req.params;
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, getErrors(errors.array()));
		console.log(id);
		
		// const { firstName, lastName, phone, address } = req.body;
		// if (!id || !firstName || !isValid(id)) return Response.InvalidParams(res);
		// const result = await User.findOneAndUpdate({ _id: id }, { firstName, lastName, phone, address });
		Response.Ok(res);
	},

	deleteById: async (req, res) => {
		const { id } = req.params;
		if (!id || !isValid(id)) return Response.InvalidParams(res);
		const result = await User.deleteOne({ _id: id }).exec();
		Response.Ok(res);
	},
};
