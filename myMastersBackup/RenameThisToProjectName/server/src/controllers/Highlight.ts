import { sendJSONResponse } from '../utils';
import { IUserLessonSchema } from '../types';

export const getHighlights = async (req, res) => {
  console.log('hs getHighlights controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const highlightQueryResult = userLessonQueryResult.Highlights;
  sendJSONResponse(res, 200, highlightQueryResult);
};

export const deleteHighlights = async (req, res) => {
  console.log('hs deleteHighlights controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const userLessonQueryHighlightsID = userLessonQueryResult.Highlights.map((highlight) => {
    return highlight._id;
  });
  if (req.body.Highlights) {
    try {
      for (const id of req.body.Highlights) {
        if (userLessonQueryHighlightsID.includes(id)) {
          userLessonQueryResult.Highlights.pull(id);
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

export const postHighlights = async (req, res) => {
  console.log('hs postHighlights controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  if (req.body.Highlights) {
    try {
      for (const highlightData of req.body.Highlights) {
        if (highlightData._id) {
          userLessonQueryResult.Highlights.push(highlightData);
        } else {
          throw new Error();
        }
      }
      userLessonQueryResult.Highlights.sort((a, b) => {
        return (a.TimeRange.start - b.TimeRange.start);
      });
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
