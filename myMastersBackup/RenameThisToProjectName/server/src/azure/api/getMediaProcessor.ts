import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Get a media processor ID to submit subsequent jobs to
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function getMediaProcessor (processorName : string, accessToken : string) : Promise < string > {

  const encodedProcessorName: string = encodeURIComponent(processorName);
  const url: string =
    ApiConfig.MEDIA_SERVICE_BASE_URL + 'MediaProcessors()?$filter=Name%20eq%20\'' + encodedProcessorName + '\'';
  const args = {
    headers: createHeaders(accessToken),
  };

  const mediaProcessorId: string = await new Promise < string > ((resolve, reject) => {
    new Client()
      .get(url, args, (data, response) => {

        if (response.statusCode !== 200) {
          reject(`Failed to get media processor because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));
        resolve(json.value[0].Id);
      });
  });

  return mediaProcessorId;
}
