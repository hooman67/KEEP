import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Create access policy to download/stream a media asset
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function createAccessPolicy (accessToken : string) : Promise < string > {

  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'AccessPolicies';
  const args = {
    headers: createHeaders(accessToken),
    data: {
      Name: 'DownloadPolicy',
      DurationInMinutes: (365 * 24 * 60).toString(),
      Permissions: 1, // Read
    },
  };

  const accessPolicy: string = await new Promise < string > ((resolve, reject) => {
    new Client()
      .post(url, args, (data, response) => {

        if (response.statusCode !== 201) {
          reject(`Failed to create access policy because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));
        resolve(json.Id);
      });
  });

  return accessPolicy;
}
