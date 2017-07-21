import * as fs from 'fs';
import * as multer  from 'multer';
import * as mongoose from 'mongoose';
import { sendJSONResponse } from '../utils';
import {
  ILessonSchema,
  ICourseSchema,
} from '../types';

const lessonModel = mongoose.model('Lesson');
const courseModel = mongoose.model('Course');

// Store uploaded video files temporarily
export const lessonMulterSetup = multer({ dest: './lessonUploads/' }).single('Video');

// Delete video files at the end of the request
export const lessonMulterCleanup = (req, res, next) => {

  if(!req.file) {
    sendJSONResponse(res, 400, { message: 'Missing file' });
    return;
  }

  res.on('finish', () => {
    try {
      fs.stat(req.file.path, (err, stat) => {
        if (err == null) {
          fs.unlink(req.file.path);
        }
      });
    } catch (err) {
      console.log('Failed to delete file because: ' + err);
    }
  });
  next();
};

export const lessonWildAccess = async (req, res, next) => {
  const lessonID = req.params.lessonID;

  if (lessonID) {
    const lessonQueryResult = <ILessonSchema> await lessonModel.findById(lessonID);
    if (lessonQueryResult) {
      req.middleware.lessonQueryResult = lessonQueryResult;
      next();
    } else {
      sendJSONResponse(res, 404, {
        message: 'Resource Not Found',
      });
    }
  } else {
    sendJSONResponse(res, 400, {
      message: 'Required Fields Not Found',
    });
  }
};

export const lessonSubscriberAccess = async (req, res, next) => {
  const currentUser = req.middleware.User;
  const lessonQueryResult = req.middleware.lessonQueryResult;

  const getAuthorization = await lessonQueryResult.getAuthorization(currentUser);
  if (!getAuthorization.error) {
    if (getAuthorization.status) {
      req.middleware.lessonQueryResult = lessonQueryResult;
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
};

export const lessonCreateAccess = async (req, res, next) => {
  const currentUser = req.middleware.User;
  if (currentUser.Type !== 'TEACHER') {
    sendJSONResponse(res, 401, { message: 'Unauthorized Access' });
    return;
  }

  if (!req.body.Course) {
    sendJSONResponse(res, 400, { message: 'Required field Course is not found' });
    return;
  }

  const courseQueryResult = <ICourseSchema> await courseModel.findById(req.body.Course);
  if (!courseQueryResult) {
    sendJSONResponse(res, 404, { message: 'Resource Course is not found'  });
    return;
  }

  if (courseQueryResult.Owner !== currentUser._id) {
    sendJSONResponse(res, 401, { message: 'Unauthorized access, not a course owner' });
    return;
  }

  next();
};

export const lessonOwnerAccess = async (req, res, next) => {
  const currentUser = req.middleware.User;
  const lessonQueryResult = req.middleware.lessonQueryResult;

  const getAuthorization = await lessonQueryResult.editAuthorization(currentUser);
  if (!getAuthorization.error) {
    if (getAuthorization.status) {
      req.middleware.lessonQueryResult = lessonQueryResult;
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
};
