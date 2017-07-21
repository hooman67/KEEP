import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { sendJSONResponse } from '../utils';

const userLessonModel = mongoose.model('UserLesson');

export const userLessonSubscriberAccess = async (req, res, next) => {
  const lessonQueryResult = req.middleware.lessonQueryResult;
  const currentUser = req.middleware.User;

  try {
    const userLessonQueryResult = await userLessonModel
      .findById(crypto.createHash('sha256')
        .update(currentUser._id + lessonQueryResult._id)
        .digest('hex'));

    if (userLessonQueryResult) {
      req.middleware.userLessonQueryResult = userLessonQueryResult;
      next();
    } else {
      sendJSONResponse(res, 404, {
        message: 'Resource Not Found',
      });
    }
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};
