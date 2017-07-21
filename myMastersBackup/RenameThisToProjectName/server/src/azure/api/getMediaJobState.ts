import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Definition: https://docs.microsoft.com/en-us/rest/api/media/operations/job
export enum JobState {
  Queued,
  Scheduled,
  Processing,
  Finished,
  Error,
  Canceled,
  Canceling,
}

// Get state of media processing job
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function getMediaJobState (jobId : string, accessToken : string) : Promise < JobState > {

  const jobIdEncoded = encodeURI(jobId);
  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Jobs(\'' + jobIdEncoded + '\')/State';
  const args = {
    headers: createHeaders(accessToken),
  };

  const jobState: JobState = await new Promise < JobState > ((resolve, reject) => {
    new Client()
      .get(url, args, (data, response) => {

        if (response.statusCode !== 200) {
          reject(`Failed to get job state because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));
        const jobState = json.value;

        resolve(jobState);
      });
  });

  return jobState;
}
