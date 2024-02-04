import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
	{
		firstName: { type: String, default: '', required: true },
		lastName: { type: String, default: '' },
		email: { type: String, default: '', required: true, unique: true },
		password: { type: String, default: '', required: true },
		phone: { type: String, default: '' },
		address: { type: String, default: '' },
		avatar: { type: String, default: '' },
		role: { type: Number, default: 0 },
		active: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

userSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

userSchema.virtual('fullname').get(function () {
	return `${this.firstName || ''} ${this.lastName || ''}`.trim()
});

userSchema.statics.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};
userSchema.statics.comparePassword = async (password, receivedPassword) => {
	return await bcrypt.compare(password, receivedPassword);
};

userSchema.methods.isValidPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id;
	},
});

export default model('User', userSchema);
