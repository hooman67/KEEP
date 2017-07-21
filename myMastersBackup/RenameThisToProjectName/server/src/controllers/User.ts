import * as mongoose from 'mongoose';
import * as uuid from 'uuid';
import { sendJSONResponse } from '../utils';

const userModel = mongoose.model('User');

export const postUser = async (req, res) => {
  const newUser = {
    _id: (req.body.UUID) ? req.body.UUID : uuid.v4(),
    Courses: [],
    Type: req.body.Type,
    School: req.body.School,
  };

  try {
    const result = await userModel.create(newUser);
    sendJSONResponse(res, 200, {
      UUID: result._id,
    });
  } catch (e) {
    sendJSONResponse(res, 400, e);
  }
};
