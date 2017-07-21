import * as mongoose from 'mongoose';
import { IUserSchema } from '../types';

export const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  Courses: [{
    type: String,
    ref: 'Course',
  }],
  Type: {
    type: String,
    required: true,
    enum: ['TEACHER', 'STUDENT'],
  },
  School: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUserSchema>('User', userSchema);
