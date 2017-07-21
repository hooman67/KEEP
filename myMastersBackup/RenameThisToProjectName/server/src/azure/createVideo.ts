import * as mongoose from 'mongoose';
import * as uuid from 'uuid';
import {
  JobType,
  IAsset,
  getAccessToken,
  createAsset,
  createAssetFile,
  createAndUploadBlob,
  deleteAsset,
  cancelJob,
  updateAssetFile,
  getMediaProcessor,
  createMediaJob,
} from './api';
import { IMediaJobSchema } from '../types';

export interface ICreateVideoResult {
  AssetId : string;
  EncodingJobId : string;
  IndexJobId : string;
  ThumbnailsJobId : string;
}

// Given a video file, upload and start encoding/analysis jobs
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function createVideo (lessonID, file) : Promise < ICreateVideoResult > {

  const assetName = 'Lesson';
  const assetFileName = 'Video';

  let accessToken: string;
  let asset: IAsset;
  let encodingJobId: string;
  let thumbnailsJobId: string;
  let indexJobId: string;

  try {
    // Get Azure Media Services access token
    accessToken = await getAccessToken();

    // Create asset to hold uploaded video
    asset = await createAsset(assetName, accessToken);

    // Create file within the asset to contain the uploaded video blob
    const assetFileId : string = await createAssetFile(assetFileName, file.mimeType, asset.id, accessToken);

    // Create and upload the video file into a blob
    await createAndUploadBlob(assetFileName, file.path, asset.containerId);

    // Update the asset file information
    await updateAssetFile(assetFileName, asset.id, assetFileId, file.size, accessToken);

    // Get a media processor for encoding and thumbnail generation
    const standardMediaProcessorId : string = await getMediaProcessor('Media Encoder Standard', accessToken);

    // Get a media processor for transcript indexing
    const indexMediaProcessorId : string = await getMediaProcessor('Azure Media Indexer 2 Preview', accessToken);

    // Create job to encode the video (for download and adaptive streaming)
    encodingJobId =
      await createMediaJob(JobType.Encoding, lessonID, asset.location, standardMediaProcessorId, accessToken);

    // Create job to generate thumbnails for the video
    thumbnailsJobId =
      await createMediaJob(JobType.Thumbnails, lessonID, asset.location, standardMediaProcessorId, accessToken);

    // Create job to index the video (generate transcript)
    indexJobId =
      await createMediaJob(JobType.Index, lessonID, asset.location, indexMediaProcessorId, accessToken);

    // If we got this far everything went as planned - persist the pending jobs in
    // the database for monitoring
    persistMediaJob(JobType.Encoding, encodingJobId, lessonID);
    persistMediaJob(JobType.Thumbnails, thumbnailsJobId, lessonID);
    persistMediaJob(JobType.Index, indexJobId, lessonID);

    return {
      AssetId: asset.id,
      EncodingJobId: encodingJobId,
      IndexJobId: indexJobId,
      ThumbnailsJobId: thumbnailsJobId,
    };
  } catch (e) {

    // Delete asset
    await deleteAsset(asset.id, accessToken);

    // Cancel jobs
    if (encodingJobId) {
      await cancelJob(encodingJobId, accessToken);
    }

    if (thumbnailsJobId) {
      await cancelJob(thumbnailsJobId, accessToken);
    }

    if (indexJobId) {
      await cancelJob(indexJobId, accessToken);
    }

    throw e;
  }
}

// Store in database so concurrent monitoring processing can respond to changes
async function persistMediaJob (type : JobType, jobId : string, lessonId : string) {

  const mediaJobModel = mongoose.model('MediaJob');
  const job = <IMediaJobSchema> {};
  job._id = uuid.v4();
  job.JobID = jobId;
  job.JobType = type;
  job.Lesson = lessonId;

  await mediaJobModel.create(job);
}
