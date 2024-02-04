import { body, validationResult } from 'express-validator';

import { Content, Role } from '../models/index';
import Response from '../helpers/helperResponse';
import mongo from '../helpers/helperMongoose';

export default {
	validate: {
		create: [
			body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char'),
			body('email', 'Invalid email').exists().isEmail(),
			body('password').exists().isLength({ min: 6 }),
		],
		update: [body('firstName', 'firstName doesnt exists').exists().isLength({ min: 2 }).withMessage('min 2 char')],
	},

	create: async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { email, password, firstName } = req.body;
		const find = await Content.findOne({ email });
		if (find) return Response.BadRequest(res, 'user already exists');

		const role = await Role.findOne({ name: 'user' });
		const user = new Content({ email, firstName, role: role.value, password: await Content.encryptPassword(password) });
		await user.save();
		return Response.Create(res);
	},

	get: async (req, res) => {
		const users = await Content.find({}, '-password').exec();
		if (!users) return Response.NotFoundUser(res);
		res.json({ users });
	},

	getById: async (req, res) => {
		const { id } = req.params;
		if (!id || !mongo.isValid(id)) return Response.InvalidParams(res);
		const user = await Content.findOne({ _id: id }, '-password -createdAt -updatedAt').populate('roles', '-_id').exec();
		if (!user) return Response.NotFoundUser(res);
		res.json(user);
	},

	updateById: async (req, res) => {
		const { id } = req.params;
		const errors = validationResult(req);
		if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });

		const { firstName, lastName, phone, address } = req.body;
		if (!id || !firstName || !mongo.isValid(id)) return Response.InvalidParams(res);
		const result = await Content.findOneAndUpdate({ _id: id }, { firstName, lastName, phone, address });
		Response.Ok(res);
	},

	deleteById: async (req, res) => {
		const { id } = req.params;
		if (!id || !mongo.isValid(id)) return Response.InvalidParams(res);
		const result = await Content.deleteOne({ _id: id }).exec();
		Response.Ok(res);
	},
};
