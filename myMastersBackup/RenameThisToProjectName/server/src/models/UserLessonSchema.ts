import * as mongoose from 'mongoose';
import * as validator from 'validator';
import { IUserLessonSchema } from '../types';

const highlightSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  Color: {
    type: String,
    required: true,
  },
  TimeRange: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
});

const commentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  TimeStamp: {
    type: String,
    required: true,
  },
  Color: {
    type: String,
    required: true,
  },
  TimeRange: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
  Text:{
    type: String,
    required: true,
  },
  Parent:{
    type: String,
  },
  Replies: [this],
});

const noteSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  Color: {
    type: String,
    required: true,
  },
  Comment: {
    type: String,
    required: true,
  },
  TimeRange: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
});

const singleVieCount = new mongoose.Schema(
  {
    StartTimeStamp: {
      type: Number,
      required: true,
    },
    EndTimeStamp: {
      type: Number,
      required: true,
    },
    Counter: {
      type: Number,
      required: true,
    },
  },
  {
    _id : false,
  },
);

const userLessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  Lesson: {
    type: String,
    ref: 'Lesson',
  },
  Highlights: [highlightSchema],
  Comments: [commentSchema],
  Notes: [noteSchema],
  ViewCounts: {
    Aggregated: {
      type: [singleVieCount],
    },
    New: {
      type: [singleVieCount],
    },
  },
});

userLessonSchema.pre('validate', function (next) {
  const newHighlightsID = this.Highlights.map((highlight) => {
    if (validator.isUUID(highlight._id)) {
      return highlight._id;
    } else {
      next(new Error());
    }
  });
  const newCommentsID = this.Comments.map((comment) => {
    if (validator.isUUID(comment._id)) {
      //  console.log('hsDebServ UserLessonSchema.ts passed 132');
      return comment._id;
    } else {
      next(new Error());
    }
  });
  const newNotesID = this.Notes.map((note) => {
    if (validator.isUUID(note._id)) {
      return note._id;
    } else {
      next(new Error());
    }
  });
  const newHighlightsIDSet = new Set(newHighlightsID);
  const newCommentsIDSet = new Set(newCommentsID);
  const newNotesIDSet = new Set(newNotesID);

  if ((newHighlightsIDSet.size !== newHighlightsID.length) || (newNotesIDSet.size !== newNotesID.length) || (newCommentsIDSet.size !== newCommentsID.length)) {
    next(new Error());
  }
  //  console.log('hsDebServ UserLessonSchema.ts passed 152');
  next();
});

export default mongoose.model<IUserLessonSchema>('UserLesson', userLessonSchema);
