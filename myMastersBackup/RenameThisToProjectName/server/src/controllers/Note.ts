import { sendJSONResponse } from '../utils';
import { IUserLessonSchema } from '../types';

export const getNotes = async (req, res) => {
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const notesQueryResult = userLessonQueryResult.Notes;
  sendJSONResponse(res, 200, notesQueryResult);
};

export const deleteNotes = async (req, res) => {
  const userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const userLessonQueryNotesID = userLessonQueryResult.Notes.map((note) => {
    return note._id;
  });
  if (req.body.Notes) {
    try {
      for (const id of req.body.Notes) {
        if (userLessonQueryNotesID.includes(id)) {
          userLessonQueryResult.Notes.pull(id);
        } else {
          throw new Error();
        }
      }
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};

export const postNotes = async (req, res) => {
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  if (req.body.Notes) {
    try {
      for (const noteData of req.body.Notes) {
        userLessonQueryResult.Notes.push(noteData);
      }
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};
