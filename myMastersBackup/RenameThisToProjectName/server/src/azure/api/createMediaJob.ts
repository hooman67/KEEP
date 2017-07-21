import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

export enum JobType {
  Encoding,
  Index,
  Thumbnails,
}

// Create media processing job on existing media asset
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function createMediaJob
  (jobType: JobType, lessonID: string, assetLocation: string, mediaProcessorId: string, accessToken: string)
  : Promise<string> {

  const configuration: string = getJobConfiguration(jobType);

  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Jobs';
  const jobName: string = JobType[jobType] + '_' + lessonID;
  const args = {
    headers: createHeaders(accessToken),
    data: {
      Name: jobName,
      InputMediaAssets: [
        {
          __metadata: {
            uri: assetLocation,
          },
        },
      ],
      Tasks: [
        {
          Configuration: configuration,
          MediaProcessorId: mediaProcessorId,
          TaskBody:
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<taskBody>' +
            '<inputAsset>JobInputAsset(0)</inputAsset>' +
            '<outputAsset assetName="' + jobName + '">JobOutputAsset(0)</outputAsset>' +
            '</taskBody>',
        },
      ],
    },
  };

  const jobId: string = await new Promise<string>((resolve, reject) => {
    new Client().post(url, args, (data, response) => {

      if (response.statusCode !== 201) {
        // tslint:disable-next-line:max-line-length
        reject(`Failed to create media processing job [${JobType[jobType]}] because ${response.statusCode}: ${response.statusMessage}`);
        return;
      }

      const json = JSON.parse(data.toString('utf8'));
      resolve(json.Id);
    });
  });

  return jobId;
}

function getJobConfiguration (jobType: JobType): string {

  // See https://docs.microsoft.com/en-us/azure/media-services/media-services-mes-presets-overview
  // and https://docs.microsoft.com/en-us/azure/media-services/media-services-mes-schema

  if (jobType === JobType.Encoding) {

    // Encode video at various bitrates for adaptive bitrate streaming (provides streaming manifest and download files)
    return 'Adaptive Streaming';
  }

  if (jobType === JobType.Index) {

    // Generate VTT file based on En-US locale
    const configuration = {
      version: '1.0',
      Features: [
        {
          Options: {
            Formats: ['WebVtt'],
            Language: 'enUs',
            Type: 'RecoOptions',
          },
          Type: 'SpReco',
        },
      ],
    };

    return JSON.stringify(configuration);
  }

  if (jobType === JobType.Thumbnails) {

    // Generate thumbnails of the given type, dimensions and step size
    const configuration = {
      Version: 1.0,
      Codecs: [
        {
          JpgLayers: [
            {
              Quality: 90,
              Type: 'JpgLayer',
              Width: 480,
              Height: 360,
            },
          ],
          Start: '0%',
          Step: '00:00:05',
          Range: '100%',
          Type: 'JpgImage',
        },
      ],
      Outputs: [
        {
          FileName: '{Index}{Extension}',
          Format: { Type: 'JpgFormat' },
        },
      ],
    };

    return JSON.stringify(configuration);
  }

  throw new RangeError(`Configuration not found for JobType: ${jobType}`);
}
