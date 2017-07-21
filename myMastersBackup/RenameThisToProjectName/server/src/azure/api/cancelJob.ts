import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Cancel media processing job
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function cancelJob (jobId: string, accessToken: string) {

  const encodedJobId: string = encodeURI(jobId);
  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'CancelJob?jobid=\'' + encodedJobId + '\'';
  const args = {
    headers: createHeaders(accessToken),
  };

  await new Promise((resolve, reject) => {
    new Client().get(url, args, (data, response) => {
      if (response.statusCode !== 204) {
        reject(`Failed to cancel media job ${jobId} because ${response.statusCode}: ${response.statusMessage}`);
        return;
      }
      resolve();
    });
  });
}
