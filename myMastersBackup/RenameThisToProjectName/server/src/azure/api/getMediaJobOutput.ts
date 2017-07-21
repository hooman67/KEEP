import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Get the output asset for a media processing job
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function getMediaJobOutput (jobId : string, accessToken : string) : Promise < string > {

  const jobIdEncoded: string = encodeURI(jobId);
  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Jobs(\'' + jobIdEncoded + '\')/OutputMediaAssets()';
  const args = {
    headers: createHeaders(accessToken),
  };

  const outputAssetId: string = await new Promise < string > ((resolve, reject) => {
    new Client()
      .get(url, args, (data, response) => {

        if (response.statusCode !== 200) {
          reject(`Failed to get job output because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));
        resolve(json.value[0].Id);
      });
  });

  return outputAssetId;
}
