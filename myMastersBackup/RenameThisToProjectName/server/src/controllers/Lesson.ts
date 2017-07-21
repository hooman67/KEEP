import * as mongoose from 'mongoose';
import * as uuid from 'uuid';
import { sendJSONResponse } from '../utils';
import { ICreateVideoResult, createVideo } from '../azure/createVideo';
import {
  ILessonSchema,
  IVideo,
} from '../types';

const lessonModel = mongoose.model('Lesson');

interface IGetLessonResponse {
  ID: string;
  Name: string;
  Owner: string;
  Summary: string;
  ReleaseDate: any;
  Status: string;
  Video: IVideo;
  Transcript: string;
  PreviewImages: string;
}

export const getLesson = async (req, res) => {
  const lessonQueryResult = req.middleware.lessonQueryResult;
  try {
    const result: IGetLessonResponse = getLessonResponse(lessonQueryResult);

    sendJSONResponse(res, 200, result);
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

function getLessonResponse (lessonQueryResult): IGetLessonResponse {

  const result = {
    ID: lessonQueryResult._id,
    Name: lessonQueryResult.Name,
    Owner: lessonQueryResult.Owner,
    Summary: lessonQueryResult.Summary,
    ReleaseDate: lessonQueryResult.ReleaseDate,
    Status: lessonQueryResult.Status,
    Video: null,
    Transcript: null,
    PreviewImages: null,
  };

  if (result.Status === 'Ready') {
    result.Video = lessonQueryResult.Video;
    result.Transcript = lessonQueryResult.Transcript;
    result.PreviewImages = lessonQueryResult.PreviewImages;
  }

  return result;
}

export const deleteLesson = async (req, res) => {
  const lessonQueryResult = req.middleware.lessonQueryResult;
  try {
    await lessonQueryResult.remove();
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

export const putLesson = async (req, res) => {
  const lessonQueryResult = req.middleware.lessonQueryResult;

  for (const entry in req.body) {
    switch (entry) {
      case 'Name':
        break;
      case 'Summary':
        break;
      case 'Transcript':
        break;
      default:
        sendJSONResponse(res, 400, {
          message: 'Bad request, unexpected field: ' + entry,
        });
        return;
    }

    // TODO: Sanitize input

    lessonQueryResult[entry] = req.body[entry];
  }
  try {
    await lessonQueryResult.save();
    const result: IGetLessonResponse = getLessonResponse(lessonQueryResult);
    sendJSONResponse(res, 200, result);
  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};

export const postLessons = async (req, res) => {

  const currentUser = req.middleware.User;

  // TODO: Sanitize all inputs

  if (!req.body.Name) {
    sendJSONResponse(res, 400, { message: 'Missing field Name' });
    return;
  }

  if (!req.body.Summary) {
    sendJSONResponse(res, 400, { message: 'Missing field Summary' });
    return;
  }

  if (!req.body.ReleaseDate) {
    sendJSONResponse(res, 400, { message: 'Missing field ReleaseDate' });
    return;
  }

  if (req.file.size > 1073741824) {
    sendJSONResponse(res, 400, { message: 'File too large, must be smaller than 1gb' });
    return;
  }

  if (!req.file.mimetype.startsWith('video/')) {
    sendJSONResponse(res, 400, { message: 'File MIME type must be video' });
    return;
  }

  const lessonId = (req.body.UUID) ? (req.body.UUID) : uuid.v4();

  let createVideoResponse: ICreateVideoResult;

  try {
    createVideoResponse = await createVideo(lessonId, req.file);
  } catch (e) {
    sendJSONResponse(res, 500, 'Failed to create video: ' + e);
  }

  try {
    const newLesson = <ILessonSchema> {
      _id: lessonId,
      Name: req.body.Name,
      Owner: currentUser._id,
      Summary: req.body.Summary,
      Status: 'New',
      ReleaseDate: new Date(), // TODO: Replace with whatever user request provides
      Courses: [req.body.Course],
      Azure: {
        InputAsset: createVideoResponse.AssetId,
        VideoAsset: null,
        IndexAsset: null,
        ThumbnailsAsset: null,
        EncodingJob: createVideoResponse.EncodingJobId,
        IndexJob: createVideoResponse.IndexJobId,
        ThumbnailsJob: createVideoResponse.ThumbnailsJobId,
      },
      Video: {
        StreamingManifestUrl: null,
        DownloadUrl: null,
      },
      Transcript: null,
      PreviewImages: null,
    };
    const lessonCreateResult = await lessonModel.create(newLesson);

    sendJSONResponse(res, 201, lessonId);

  } catch (e) {
    sendJSONResponse(res, 500, e);
  }
};
