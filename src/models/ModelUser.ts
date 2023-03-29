import { Schema, Model, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
  phone: string;
  address: string;
  active: boolean;
  isValidPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  encryptPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, receivedPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.virtual('id').get(function (this: IUser) {
  return this._id.toHexString();
});

userSchema.statics.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

userSchema.methods.isValidPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;
