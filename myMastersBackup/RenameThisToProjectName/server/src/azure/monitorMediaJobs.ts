import * as mongoose from 'mongoose';
import * as https from 'https';
import * as fs from 'fs';
import {
  LocatorType,
  JobState,
  JobType,
  ILocator,
  getAccessToken,
  getMediaJobState,
  getMediaJobOutput,
  createAccessPolicy,
  createLocator,
} from './api';
import { ILessonSchema, ICourseSchema } from '../types';

// Poll database for pending media jobs and update lessons when jobs complete
export async function monitorMediaJobs () {

  const mediaJobModel = mongoose.model('MediaJob');
  const jobQueryResult = await mediaJobModel.find({}).select('_id JobID JobType Lesson');

  if (jobQueryResult) {
    for (const job of jobQueryResult) {
      // Start and end something which leaves the job in a safe state
      // For now we check jobs sequentially due to limited scale and to make sure lesson updates are atomic
      await checkJob(job);
    }
  }

  setTimeout(monitorMediaJobs, 5000);
}

async function checkJob (job) {

  try {
    const accessToken: string = await getAccessToken();

    const jobState: JobState = await getMediaJobState(job.JobID, accessToken);

    switch (jobState) {
      case JobState.Queued:
      case JobState.Scheduled:
      case JobState.Processing:
        return;
      case JobState.Finished:
        break;
      default:
        job.remove();
        throw new RangeError('Unexpected job state: ' + jobState);
    }

    const assetId: string = await getMediaJobOutput(job.JobID, accessToken);

    if (!assetId) {
      throw new Error('Unable to retrieve asset for job ' + job.JobID);
    }

    const jobType: JobType = job.JobType;
    const lessonId: string = job.Lesson;

    switch (jobType) {
      case JobType.Encoding:
        await finishEncoding(lessonId, assetId, accessToken);
        break;
      case JobType.Index:
        await finishIndexing(lessonId, assetId, accessToken);
        break;
      case JobType.Thumbnails:
        await finishThumbnails(lessonId, assetId, accessToken);
        break;
      default:
        job.remove();
        throw new RangeError('Unexpected job type: ' + jobType);
    }

    job.remove();
    console.log('Job completed successfully: ' + job.JobID);
  } catch (e) {
    console.log('Polling for job failed: ' + e);
  }
}

async function finishEncoding (lessonId: string, assetId: string, accessToken: string) {

  const lessonModel = mongoose.model('Lesson');
  const lesson = <ILessonSchema> await lessonModel.findById(lessonId);

  // TODO: Introduce logic to determine best bit rate since this will depend on aspect ratio/quality of original video
  const downloadFileName: string = 'Video_360x270_160.mp4';
  const streamingManifestFileName: string = 'Video.ism/manifest(format=m3u8-aapl)';

  const downloadUrl: string = await createDownloadUrl(assetId, downloadFileName, accessToken);
  const streamingUrl: string = await createStreamingUrl(assetId, streamingManifestFileName, accessToken);

  if (!downloadUrl || !streamingUrl) {
    throw new Error('Unable to create download & streaming URLs for asset ' + assetId);
  }

  await lessonModel.findByIdAndUpdate(lessonId, {
    $set: {
      'Azure.VideoAsset': assetId,
      'Video.StreamingManifestUrl': streamingUrl,
      'Video.DownloadUrl': downloadUrl,
    },
  });

  await checkLessonReadiness(lessonId);
}

async function finishIndexing (lessonId: string, assetId: string, accessToken: string) {

  const lessonModel = mongoose.model('Lesson');
  const lesson = <ILessonSchema> await lessonModel.findById(lessonId);

  const downloadFileName: string = 'Video_aud_SpReco.vtt';
  const downloadUrl: string = await createDownloadUrl(assetId, downloadFileName, accessToken);

  if (!downloadUrl) {
    throw new Error('Unable to create download URL for asset ' + assetId);
  }

  const vttContent = await readHttpsFile(downloadUrl);

  if (!vttContent) {
    throw new Error('Unable to fetch VTT file for asset ' + assetId);
  }

  await lessonModel.findByIdAndUpdate(lessonId, {
    $set: {
      'Azure.IndexAsset': assetId,
      Transcript: vttContent,
    },
  });

  await checkLessonReadiness(lessonId);
}

async function finishThumbnails (lessonId: string, assetId: string, accessToken: string) {

  const lessonModel = mongoose.model('Lesson');
  const lesson = <ILessonSchema> await lessonModel.findById(lessonId);

    // TODO: Introduce logic to download thumbnails, generate spritemap, upload as blob and persist URL
  const downloadFileName: string = '000001.jpg';
  const downloadUrl: string = await createDownloadUrl(assetId, downloadFileName, accessToken);

  if (!downloadUrl) {
    throw new Error('Unable to create download URL for asset ' + assetId);
  }

  await lessonModel.findByIdAndUpdate(lessonId, {
    $set: {
      'Azure.ThumbnailsAsset': assetId,
      PreviewImages: downloadUrl,
    },
  });

  await checkLessonReadiness(lessonId);
}

async function checkLessonReadiness (lessonId) {

  const courseModel = mongoose.model('Course');
  const lessonModel = mongoose.model('Lesson');
  const lesson = <ILessonSchema> await lessonModel.findById(lessonId);

  if (lesson.Azure.VideoAsset && lesson.Azure.IndexAsset && lesson.Azure.ThumbnailsAsset) {

    await lessonModel.findByIdAndUpdate(lesson._id, { $set: { Status: 'Ready' } });

    for (const courseId of lesson.Courses) {
      await courseModel.findByIdAndUpdate(courseId, { $push: { 'PlayLists.0.Lessons': lessonId } });
    }
  }
}

async function createDownloadUrl (assetId, fileName, accessToken): Promise<string> {

  const accessPolicyId: string = await createAccessPolicy(accessToken);
  const locator: ILocator = await createLocator(LocatorType.SAS, assetId, accessPolicyId, accessToken);
  const downloadUrl: string = locator.BaseUri + '/' + fileName + locator.ContentAccessComponent;

  return downloadUrl;
}

async function createStreamingUrl (assetId, fileName, accessToken): Promise<string> {

  const accessPolicyId: string = await createAccessPolicy(accessToken);
  const locator: ILocator = await createLocator(LocatorType.OnDemandOrigin, assetId, accessPolicyId, accessToken);
  const streamingUrl = locator.Path + fileName;

  return streamingUrl;
}

async function readHttpsFile (sourceUrl) {

  const fileContent = await new Promise((resolve, reject) => {
    const request = https.get(sourceUrl, (response) => {
      response.on('data', (data) => { resolve(data); });
    }).on('error', (err) => { reject(err); });
  });

  return fileContent;
}
