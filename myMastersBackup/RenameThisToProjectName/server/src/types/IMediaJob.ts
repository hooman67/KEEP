import * as mongoose from 'mongoose';

export interface IMediaJob {
  JobID: string;
  JobType: number;
  Lesson: string;
}

export interface IMediaJobSchema extends IMediaJob, mongoose.Document {}
