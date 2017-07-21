import * as mongoose from 'mongoose';
import {
  ICourseSchema,
  IUserSchema,
  ILessonSchema,
} from '../types';

export const courseSchema = new mongoose.Schema({
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
  PlayLists: [{
    _id: false,
    Name: {
      type: String,
      required: true,
    },
    Lessons: [{
      type: String,
      ref: 'Lesson',
    }],
  }],
  Subscribers: [{
    type: String,
    ref: 'User',
  }],
  School: {
    type: String,
    required: true,
  },
});

courseSchema.pre('remove', async function (next) {
  const userModel = mongoose.model('User');
  const lessonModel = mongoose.model('Lesson');
  // Iterate Through Subscribers
  for (const subscriberID of this.Subscribers) {
    const user = <IUserSchema> await userModel.findById(subscriberID);
    user.Courses.pull(this._id);
    await user.save();
  }
  // Iterate Through Lessons
  for (const playlist of this.PlayLists) {
    const Lessons = playlist.Lessons;
    for (const lessonID of Lessons) {
      const lesson = <ILessonSchema> await lessonModel.findById(lessonID);
      lesson.Courses.pull(this._id);
      await lesson.save();
    }
  }
  next();
});

export default mongoose.model<ICourseSchema>('Course', courseSchema);
