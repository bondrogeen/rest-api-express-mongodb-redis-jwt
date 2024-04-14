import { Types } from 'mongoose';

import { jsonParse, getNumber } from '../utils/general'

export const parseQuery = (query) => {
  const page = getNumber(query?.page, 1)
  const limit = getNumber(query?.limit, 5)
  const skip = (page - 1) * limit
  const sort = jsonParse(query?.sort || {})
  return { page, limit, skip, sort, }
}

export const isValid = (id) => Types.ObjectId.isValid(id);
