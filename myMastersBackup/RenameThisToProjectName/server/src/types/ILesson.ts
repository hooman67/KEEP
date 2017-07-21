import * as mongoose from 'mongoose';

export interface IVideo {
  StreamingManifestUrl: string;
  DownloadUrl: string;
}

export interface IAzureReferences {
  InputAsset: string;
  VideoAsset: string;
  IndexAsset: string;
  ThumbnailsAsset: string;
  EncodingJob: string;
  IndexJob: string;
  ThumbnailsJob: string;
}

export interface ILesson {
  Name: string;
  Owner: string;
  Summary: string;
  Status: string;
  ReleaseDate: Date;
  Courses: mongoose.Types.Array<string>;
  Azure: IAzureReferences;
  Video: IVideo;
  Transcript: string;
  PreviewImages: string;

  getAuthorization: Function;
  editAuthorization: Function;
}

export interface ILessonSchema extends ILesson, mongoose.Document {}
