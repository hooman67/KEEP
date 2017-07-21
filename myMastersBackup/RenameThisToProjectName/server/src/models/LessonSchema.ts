import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import {
  ILessonSchema,
  ICourseSchema,
} from '../types';

const courseModel = mongoose.model('Course');
const userLessonModel = mongoose.model('UserLesson');

export const lessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Owner: {
    type: String,
    required: true,
  },
  Summary: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  ReleaseDate: {
    type: Date,
    required: true,
  },
  Courses: [{
    type: String,
    ref: 'Course',
    required: true,
  }],
  Azure: {
    InputAsset: {
      type: String,
      required: true,
    },
    VideoAsset: {
      type: String,
    },
    IndexAsset: {
      type: String,
    },
    ThumbnailsAsset: {
      type: String,
    },
    EncodingJob: {
      type: String,
      required: true,
    },
    IndexJob: {
      type: String,
      required: true,
    },
    ThumbnailsJob: {
      type: String,
      required: true,
    },
  },
  Video: {
    StreamingManifestUrl: {
      type: String,
    },
    DownloadUrl: {
      type: String,
    },
  },
  Transcript: {
    type: String,
  },
  PreviewImages: {
    type: String,
  },
});

lessonSchema.methods.getAuthorization = async function (currentUser) {
  for (const courseID of this.Courses) {
    const courseQueryResult = <ICourseSchema> await courseModel.findById(courseID);
    if (courseQueryResult) {
      for (const subscriberID of courseQueryResult.Subscribers) {
        if (subscriberID === currentUser._id) {
          return {
            status: true,
            error: null,
          };
        }
      }
    } else {
      return {
        status: false,
        error: 'Resource Not Found',
      };
    }
  }
  return {
    status: false,
    error: null,
  };
};

lessonSchema.methods.editAuthorization = async function (currentUser) {
  if (this.Owner === currentUser._id) {
    return {
      status: true,
      error: null,
    };
  } else {
    return {
      status: false,
      error: null,
    };
  }
};

lessonSchema.pre('remove', async function (next) {

  // TODO: Delete Azure assets on delete

  try {
    const courseModel = mongoose.model('Course');
    let subscriberID = [];
    // Iterate Through Course PlayLists Object
    for (const courseID of this.Courses) {
      const course = <ICourseSchema> await courseModel.findById(courseID);
      subscriberID = [...subscriberID, ...course.Subscribers];
      for (const playlist of course.PlayLists) {
        if (playlist.Lessons.includes(this._id)) {
          playlist.Lessons.pull(this._id);
        }
      }
      await course.save();
    }
    // Iterate Through UserLesson Object and Delete
    for (const subscriber of subscriberID) {
      await userLessonModel.findByIdAndRemove(crypto.createHash('sha256').update(subscriber + this._id).digest('hex'));
    }
    next();
  } catch (e) {
    next(new Error(e));
  }
});

export default mongoose.model<ILessonSchema>('Lesson', lessonSchema);
