import * as mongoose from 'mongoose';

export interface IHighlight extends mongoose.Types.Subdocument {
  _id: string;
  Color: string;
  TimeRange: {
    start: number;
    end: number;
  };
}

export interface IComment extends mongoose.Types.Subdocument {
  _id: string;
  Color: string;
  TimeRange: {
    start: number;
    end: number;
  };
  Text: string;
  Parent: string;
  //Replies: Array<string>;
  //Below works if you change the CommentHelper.ts aswell
  Replies: Array<IComment>;
}

export interface INote extends mongoose.Types.Subdocument {
  _id: string;
  Color: string;
  Comment: string;
  TimeRange: {
    start: number;
    end: number;
  };
}

export interface ISingleViewCount extends mongoose.Types.Subdocument {
  StartTimeStamp: number;
  EndTimeStamp: number;
  Counter: number;
}

export interface IUserLesson {
  Lesson: string;
  Highlights: mongoose.Types.Array<IHighlight>;
  Comments: mongoose.Types.Array<IComment>;
  Notes: mongoose.Types.Array<INote>;
  // TODO: CHANGE TYPE
  ViewCounts: {
    Aggregated: mongoose.Types.Array<ISingleViewCount>,
    New: mongoose.Types.Array<ISingleViewCount>,
  };
}

export interface IUserLessonSchema extends IUserLesson, mongoose.Document {}
