import { Schema, model } from 'mongoose';

export const ROLES = {
  admin: 0b10000000,
  moderator: 0b01000000,
  user: 0b00100000,
};

const roleSchema = new Schema(
  {
    name: {
      type: String,
    },
    value: {
      type: Number,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model('Role', roleSchema);
