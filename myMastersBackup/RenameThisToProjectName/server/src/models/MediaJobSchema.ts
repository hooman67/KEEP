import * as mongoose from 'mongoose';
import { IMediaJobSchema } from '../types';

export const mediaJobSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  JobID: {
    type: String,
    required: true,
  },
  JobType: {
    type: Number,
    required: true,
  },
  Lesson: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IMediaJobSchema>('MediaJob', mediaJobSchema);
