import * as mongoose from 'mongoose';

export interface IUser {
  Courses: mongoose.Types.Array<string>;
  Type: ('STUDENT' | 'TEACHER');
  School: string;
}

export interface IUserSchema extends IUser, mongoose.Document {}
