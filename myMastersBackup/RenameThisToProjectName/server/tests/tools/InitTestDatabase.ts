import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import {
  IUserSchema,
  ICourseSchema,
  ILessonSchema,
  IMediaJobSchema
} from '../../src/types';
import '../../src/models';
import {
  IHighlight, INote, ISingleViewCount,
  IUserLessonSchema,
} from '../../src/types/IUserLesson';

/*
Student1 Student2 Teacher1 Teacher2 Student 98 Student99
Course1  Course2
Lesson1  Lesson2

        / Course1
Student1
        \ Course2

        / Course1
Student1
        \ Course2

Student99

Student98 - Course1

         Owner         Subscriber / Student 98
Teacher1 ----- Course1 ---------- - Student 1
                                  \ Student 2

         Owner         Subscriber / Student 1
Teacher2 ----- Course2 ----------
                                  \ Student 2

        PlayList[default]
Course1 ----------------- Lesson1

        PlayList[default]
Course2 ----------------- Lesson2

        Course
Lesson1 ------ Course1

        Course
Lesson2 ------ Course2

        Owner
Lesson1 ----- Teacher1

        Owner
Lesson2 ----- Teacher2

        Has
Lesson1 --- UserLessonData - Student1

        Has
Lesson2 --- UserLessonData - Student2
 */

export const InitTestDatabase = async (done) => {
  const userModel = mongoose.model('User');
  const courseModel = mongoose.model('Course');
  const lessonModel = mongoose.model('Lesson');
  const userLessonModel = mongoose.model('UserLesson');
  const mediaJobModel = mongoose.model('MediaJob');

  const userArray: Array<IUserSchema> = [
    <IUserSchema> {
      _id: '00000000-0000-0000-0001-000000000001',
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000001', '00000000-0000-0001-0000-000000000002'],
      Type: 'STUDENT',
      School: 'UBC',
    },
    <IUserSchema> {
    _id: '00000000-0000-0000-0001-000000000002',
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000001', '00000000-0000-0001-0000-000000000002'],
      Type: 'STUDENT',
      School: 'UBC',
    },
    <IUserSchema> {
      _id: '00000000-0000-0000-0002-000000000001',
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000001'],
      Type: 'TEACHER',
      School: 'UBC',
    },
    <IUserSchema> {
      _id: '00000000-0000-0000-0002-000000000002',
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000002'],
      Type: 'TEACHER',
      School: 'UBC',
    },
    <IUserSchema> {
      _id: '00000000-0000-0000-0001-000000000098',
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000001'],
      Type: 'STUDENT',
      School: 'UBC',
    },
    <IUserSchema> {
      _id: '00000000-0000-0000-0001-000000000099',
      Courses: <mongoose.Types.Array<string>> [],
      Type: 'STUDENT',
      School: 'UBC',
    },
  ];
  await userModel.remove({});
  for (const user of userArray) {
    await userModel.create(user);
  }

  // Populate Course Document
  const courseArray: Array<ICourseSchema> = [
    <ICourseSchema> {
      _id: '00000000-0000-0001-0000-000000000001',
      Name: 'LWSQU',
      Owner: '00000000-0000-0000-0002-000000000001',
      PlayLists: <mongoose.Types.Array<{ Name: string, Lessons: mongoose.Types.Array<string> }>> [
        {
          Name: 'default',
          Lessons: <Array<string>> ['00000000-0001-0000-0000-000000000001'],
        },
      ],
      Subscribers: <mongoose.Types.Array<string>> ['00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0001-000000000098'],
      School: 'UBC',
    },
    <ICourseSchema> {
      _id: '00000000-0000-0001-0000-000000000002',
      Name: 'JKFQE',
      Owner: '00000000-0000-0000-0002-000000000002',
      PlayLists: <mongoose.Types.Array<{ Name: string, Lessons: mongoose.Types.Array<string> }>> [
        {
          Name: 'default',
          Lessons: <Array<string>> ['00000000-0001-0000-0000-000000000002'],
        },
      ],
      Subscribers: <mongoose.Types.Array<string>> ['00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002'],
      School: 'UBC',
    },
  ];
  await courseModel.remove({});
  for (const course of courseArray) {
    await courseModel.create(course);
  }

  // Populate Lesson Document
  const lessonArray: Array<ILessonSchema> = [
    <ILessonSchema> {
      _id: '00000000-0001-0000-0000-000000000001',
      Name: 'FHWHZ',
      Owner: '00000000-0000-0000-0002-000000000001',
      Summary: 'YFBRF',
      Status: 'Ready',
      ReleaseDate: new Date(2017, 1, 2),
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000001'],
      Azure: {
        InputAsset: 'X',
        EncodingJob: 'Y',
        IndexJob: 'Z',
        ThumbnailsJob: 'XYZ',
      },
      Video: {
        StreamingManifestUrl: 'YPITH',
        DownloadUrl: 'PBKRB',
      },
      Transcript: 'PRBAH',
      PreviewImages: 'ABCDE',
    },
    <ILessonSchema> {
      _id: '00000000-0001-0000-0000-000000000002',
      Name: 'NERIF',
      Owner: '00000000-0000-0000-0002-000000000002',
      Summary: 'KGAQT',
      Status: 'Ready',
      ReleaseDate: new Date(2017, 1, 2),
      Courses: <mongoose.Types.Array<string>> ['00000000-0000-0001-0000-000000000002'],
      Azure: {
        InputAsset: 'X',
        EncodingJob: 'Y',
        IndexJob: 'Z',
        ThumbnailsJob: 'XYZ',
      },
      Video: {
        StreamingManifestUrl: 'YPITU',
        DownloadUrl: 'PBKRB',
      },
      Transcript: 'PRBAH',
      PreviewImages: 'ABCDE',
    },
  ];
  await lessonModel.remove({});
  for (const lesson of lessonArray) {
    await lessonModel.create(lesson);
  }

  const userLessonArray: IUserLessonSchema[] = [
    <IUserLessonSchema> {
      _id: crypto.createHash('sha256').update('00000000-0000-0000-0001-000000000001' + '00000000-0001-0000-0000-000000000001').digest('hex'),
      Lesson: '00000000-0001-0000-0000-000000000001',
      Highlights: <mongoose.Types.Array<IHighlight>> [],
      Notes: <mongoose.Types.Array<INote>> [],
      ViewCounts: {
        Aggregated: <mongoose.Types.Array<ISingleViewCount>> [
          {
            StartTimeStamp: 0,
            EndTimeStamp: Number.MAX_SAFE_INTEGER,
            Counter: 0,
          },
        ],
        New: <mongoose.Types.Array<ISingleViewCount>> [],
      },
    },
    <IUserLessonSchema> {
      _id: crypto.createHash('sha256').update('00000000-0000-0000-0001-000000000002' + '00000000-0001-0000-0000-000000000002').digest('hex'),
      Lesson: '00000000-0001-0000-0000-000000000002',
      Highlights: <mongoose.Types.Array<IHighlight>> [],
      Notes: <mongoose.Types.Array<INote>> [],
      ViewCounts: {
        Aggregated: <mongoose.Types.Array<ISingleViewCount>> [
          {
            StartTimeStamp: 0,
            EndTimeStamp: Number.MAX_SAFE_INTEGER,
            Counter: 0,
          },
        ],
        New: <mongoose.Types.Array<ISingleViewCount>> [],
      },
    },
  ];
  await userLessonModel.remove({});
  for (const userLesson of userLessonArray) {
    await userLessonModel.create(userLesson);
  }

  const jobArray: IMediaJobSchema[] = [
  // <IMediaJobSchema> {
  //   _id: '00000000-0000-0000-0001-000000000001',
  //   JobID: 'nb:jid:UUID:4dce9dff-0400-80c0-f28d-f1e752137a18',
  //   JobType: 'Encoding',
  //   Lesson: 'c9b3082c-f647-4c30-912c-e40fa0a7395d',
  // },
  // <IMediaJobSchema> {
  //   _id: '00000000-0000-0000-0001-000000000002',
  //   JobID: 'nb:jid:UUID:4dce9dff-0400-80c0-f293-f1e752137a18',
  //   JobType: 'Thumbnails',
  //   Lesson: 'c9b3082c-f647-4c30-912c-e40fa0a7395d',
  // },
  // <IMediaJobSchema> {
  //   _id: '00000000-0000-0000-0001-000000000003',
  //   JobID: 'nb:jid:UUID:4dce9dff-0400-80c0-f28d-f1e752137a18',
  //   JobType: 'Index',
  //   Lesson: 'c9b3082c-f647-4c30-912c-e40fa0a7395d',
  // },
  ];
  await mediaJobModel.remove({});
  for (const job of jobArray) {
    await mediaJobModel.create(job);
  }

  done();
};
