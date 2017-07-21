import * as mongoose from 'mongoose';
import { sendJSONResponse } from '../utils';

const userModel = mongoose.model('User');

export const generalAuth = async (req, res, next) => {
  const userUUID = req.headers.useruuid;
  if (userUUID) {
    const userQueryResult = await userModel.findById(userUUID).select('_id Type School Courses');
    if (userQueryResult) {
      req.middleware = {};
      req.middleware.User = userQueryResult;
      next();
    } else {
      sendJSONResponse(res, 401, {
        message: 'Unauthorized Access',
      });
    }
  } else {
    sendJSONResponse(res, 400, {
      message: 'Required Fields Are Not Found',
    });
  }
};
