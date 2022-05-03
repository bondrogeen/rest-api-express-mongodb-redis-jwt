import { Types } from 'mongoose';

export default {
  isValid: id => {
    return Types.ObjectId.isValid(id);
  },
};
