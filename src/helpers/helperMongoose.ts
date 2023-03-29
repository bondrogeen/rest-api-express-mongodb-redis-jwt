import { Types } from 'mongoose';

export default {
  isValid: (id: string) => {
    return Types.ObjectId.isValid(id);
  },
};
