import * as mongoose from 'mongoose';
import { sendJSONResponse } from '../utils';
import { ICourseSchema } from '../types';

const courseModel = mongoose.model('Course');

// Owner Permission
export const courseOwnerAccess = async (req, res, next) => {
  const courseID = req.params.courseID;
  const currentUser = req.middleware.User;

  if (courseID) {
    const courseQueryResult = <ICourseSchema> await courseModel.findById(courseID);
    if (courseQueryResult) {
      if (courseQueryResult.Owner === currentUser._id) {
        req.middleware.courseQueryResult = courseQueryResult;
        next();
      } else {
        sendJSONResponse(res, 401, {
          message: 'Unauthorized Access',
        });
      }
    } else {
      sendJSONResponse(res, 404, {
        message: 'Resource Not Found',
      });
    }
  } else {
    sendJSONResponse(res, 400, {
      message: 'Required Fields Are Not Found',
    });
  }
};

// Teacher Only Permission
export const courseCreateAccess = async (req, res, next) => {
  const currentUser = req.middleware.User;
  if (currentUser.Type === 'TEACHER') {
    next();
  } else {
    sendJSONResponse(res, 401, {
      message: 'Unauthorized Access',
    });
  }
};

// Subscriber Access Only
export const courseSubscriberAccess = async (req, res, next) => {
  const currentUser = req.middleware.User;
  const courseID = req.params.courseID;

  if (courseID) {
    const courseQueryResult = <ICourseSchema> await courseModel.findById(courseID);
    if (courseQueryResult) {
      if (courseQueryResult.Subscribers.includes(currentUser._id)) {
        req.middleware.courseQueryResult = courseQueryResult;
        next();
      } else {
        sendJSONResponse(res, 401, {
          message: 'Unauthorized Access',
        });
      }
    } else {
      sendJSONResponse(res, 404, {
        message: 'Resource Not Found',
      });
    }
  } else {
    sendJSONResponse(res, 400, {
      message: 'Required Fields Are Not Found',
    });
  }

};
