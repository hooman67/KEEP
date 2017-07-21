import { Client } from 'node-rest-client';
import * as ApiConfig from './config';

export async function getAccessToken () : Promise < string > {

  const args = {
    headers: {
      Accept: 'application/json',
      Connection: 'Keep-Alive',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      grant_type: 'client_credentials',
      client_id: ApiConfig.MEDIA_SERVICE_ID,
      client_secret: ApiConfig.MEDIA_SERVICE_SECRET,
      scope: 'urn:WindowsAzureMediaServices',
    },
  };

  const accessToken: string = await new Promise < string > ((resolve, reject) => {
    new Client()
      .post(ApiConfig.MEDIA_SERVICE_AUTH_URL, args, (data, response) => {

        if (response.statusCode !== 200) {
          reject(`Failed to get access token because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        resolve(data.access_token);
      });
  });

  return accessToken;
}
