import * as express from 'express';
import {
  postUser,
  getCourses,
  getCourse,
  postCourses,
  putCourse,
  deleteCourse,
  postLessons,
  getLesson,
  deleteLesson,
  putLesson,
  getHighlights,
  postHighlights,
  deleteHighlights,
 
  getComments,
  postComments,
  deleteComments,
  editComments,
 
  getNotes,
  postNotes,
  deleteNotes,
  getViewCounts,
  postViewCounts,
} from '../controllers';

// TODO: generalAuth Will Be Removed To server.ts
import {
  generalAuth,
  lessonWildAccess,
  lessonSubscriberAccess,
  lessonCreateAccess,
  lessonOwnerAccess,
  lessonMulterSetup,
  lessonMulterCleanup,
  userLessonSubscriberAccess,
  courseCreateAccess,
  courseOwnerAccess,
  courseSubscriberAccess,
} from '../middleware';

const router = express.Router();

const sendJSONResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

// User
router.route('/user').post(postUser);

// Course
router.route('/courses').get(generalAuth, getCourses);
router.route('/courses').post(generalAuth, courseCreateAccess, postCourses);
router.route('/course/:courseID').get(generalAuth, courseSubscriberAccess, getCourse);
router.route('/course/:courseID').put(generalAuth, courseOwnerAccess, putCourse);
router.route('/course/:courseID').delete(generalAuth, courseOwnerAccess, deleteCourse);

// Lesson
router.route('/lessons').post(lessonMulterSetup, lessonMulterCleanup, generalAuth, lessonCreateAccess, postLessons);
router.route('/lesson/:lessonID').get(generalAuth, lessonWildAccess, lessonSubscriberAccess, getLesson);
router.route('/lesson/:lessonID').delete(generalAuth, lessonWildAccess, lessonOwnerAccess, deleteLesson);
router.route('/lesson/:lessonID').put(generalAuth, lessonWildAccess, lessonOwnerAccess, putLesson);

// Highlights
router.route('/lesson/:lessonID/highlights')
  .get(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, getHighlights);
router.route('/lesson/:lessonID/highlights')
  .post(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, postHighlights);
router.route('/lesson/:lessonID/highlights')
  .delete(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, deleteHighlights);



// Comments
router.route('/lesson/:lessonID/comments')
  .get(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, getComments);

router.route('/lesson/:lessonID/comments')
  .post(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, postComments);

router.route('/lesson/:lessonID/comments/edit')
  .post(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, editComments);

router.route('/lesson/:lessonID/comments')
  .delete(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, deleteComments);



// Notes
router.route('/lesson/:lessonID/notes')
  .get(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, getNotes);
router.route('/lesson/:lessonID/notes')
  .post(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, postNotes);
router.route('/lesson/:lessonID/notes')
  .delete(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, deleteNotes);

// ViewCounts
router.route('/lesson/:lessonID/viewcounts')
  .get(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, getViewCounts);
router.route('/lesson/:lessonID/viewcounts')
  .post(generalAuth, lessonWildAccess, lessonSubscriberAccess, userLessonSubscriberAccess, postViewCounts);

// TODO: REMOVE TO CORRECT PLACE
import spriteSheetsGenerator from '../utils/SpriteSheetsGenerator';
router.route('/sprites')
  .post(spriteSheetsGenerator);

export default router;
