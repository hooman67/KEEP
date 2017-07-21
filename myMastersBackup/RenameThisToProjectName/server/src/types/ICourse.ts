import * as mongoose from 'mongoose';

export interface ICourse {
  Name: string;
  Owner: string;
  PlayLists: mongoose.Types.Array<{
    Name: string,
    Lessons: mongoose.Types.Array<string>,
  }>;
  Subscribers: mongoose.Types.Array<string>;
  School: string;
}

export interface ICourseSchema extends ICourse, mongoose.Document {}
