import * as mongoose from 'mongoose';
import {
  IUserLessonSchema,
  ISingleViewCount,
} from '../types';
import {
  sendJSONResponse,
  mergeViewCountInterval,
} from '../utils';

export const getViewCounts = async (req, res) => {
  const userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  try {
    let finalResult;
    if (userLessonQueryResult.ViewCounts.New.length === 0) {
      finalResult = userLessonQueryResult.ViewCounts.Aggregated;
    } else {
      finalResult = mergeViewCountInterval(
        [...userLessonQueryResult.ViewCounts.New, ...userLessonQueryResult.ViewCounts.Aggregated],
      );
      userLessonQueryResult.ViewCounts.Aggregated = finalResult;
      userLessonQueryResult.ViewCounts.New = <mongoose.Types.Array<ISingleViewCount>> [];
      await userLessonQueryResult.save();
    }
    sendJSONResponse(res, 200, finalResult);
  } catch (e) {
    sendJSONResponse(res, 500, {
      message: 'Internal Server Error',
    });
  }
};

export const postViewCounts = async (req, res) => {
  const userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  if (req.body.ViewCounts) {
    try {
      for (const viewCount of req.body.ViewCounts) {
        userLessonQueryResult.ViewCounts.New.push(viewCount);
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
