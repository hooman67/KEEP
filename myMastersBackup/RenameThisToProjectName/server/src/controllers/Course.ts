import * as mongoose from 'mongoose';
import * as uuid from 'uuid';
import { sendJSONResponse } from '../utils';
import {
  ICourseSchema,
  IUserSchema,
} from '../types';

const courseModel = mongoose.model('Course');
const userModel = mongoose.model('User');
const lessonModel = mongoose.model('Lesson');

export const getCourses = async (req, res) => {
  try {
    const currentUser = req.middleware.User;
    const response = [];
    for (const courseID of currentUser.Courses) {
      response.push(await courseModel.findById(courseID).select('_id Name Owner'));
    }
    sendJSONResponse(res, 200, response);
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

export const getCourse = async (req, res) => {
  try {
    const courseQueryResult = req.middleware.courseQueryResult;
    const courseMetadata = {
      _id: courseQueryResult._id,
      Name: courseQueryResult.Name,
      Owner: courseQueryResult.Owner,
    };
    const courseLessons = [];
    for (const playlist of courseQueryResult.PlayLists) {
      if (playlist.Name === 'default') {
        for (const lesson of playlist.Lessons) {
          courseLessons.push(await lessonModel.findById(lesson).select('_id Name Summary PreviewImages'));
        }
      }
    }
    sendJSONResponse(res, 200, {
      courseMetadata,
      courseLessons,
    });
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

export const postCourses = async (req, res) => {
  const courseName = req.body.Name;
  const currentUser = req.middleware.User;

  if (courseName) {
    try {
      // Create New Course
      const newCourse = <ICourseSchema> {};
      newCourse._id = (req.body.UUID) ? req.body.UUID : uuid.v4();
      newCourse.Name = courseName;
      newCourse.Owner = currentUser._id;
      newCourse.PlayLists = <mongoose.Types.Array<{ Name: string, Lessons: mongoose.Types.Array<string> }>> [
        {
          Name: 'default',
          Lessons: <mongoose.Types.Array<string>> [],
        },
      ];
      newCourse.Subscribers = <mongoose.Types.Array<string>> [];
      newCourse.School = currentUser.School;
      const courseCreateResult = await courseModel.create(newCourse);

      // Update User Field1
      currentUser.Courses = [...currentUser.Courses, courseCreateResult._id];
      await currentUser.save();

      // return result
      sendJSONResponse(res, 200, {
        UUID: courseCreateResult._id,
      });
    } catch (e) {
      sendJSONResponse(res, 500, e);
    }
  } else {
    sendJSONResponse(res, 400, {
      message: 'Required Fields Are Not Found',
    });
  }
};

export const deleteCourse = async (req, res) => {
  const courseQueryResult = req.middleware.courseQueryResult;
  try {
    await courseQueryResult.remove();
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

export const putCourse = async (req, res) => {
  const newCourse = req.middleware.courseQueryResult;
  for (const entry in req.body) {
    // Check PUT Request Data Field
    switch (entry) {
      case 'Owner':
        const newOwner = <IUserSchema> await userModel.findById(req.body[entry]);
        if (newOwner.Type !== 'TEACHER') {
          sendJSONResponse(res, 401, {
            message: 'Unauthorized Access',
          });
          return;
        }
        break;
      case 'Name':
        break;
      default:
        sendJSONResponse(res, 401, {
          message: 'Unauthorized Access',
        });
        return;
    }
    newCourse[entry] = req.body[entry];
  }
  try {
    await newCourse.save();
    sendJSONResponse(res, 200, {
      _id: newCourse._id,
      Name: newCourse.Name,
      Owner: newCourse.Owner,
    });
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};
